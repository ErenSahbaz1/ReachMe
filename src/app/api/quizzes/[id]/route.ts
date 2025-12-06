/**
 * 🎯 SINGLE QUIZ ENDPOINT
 *
 * GET /api/quizzes/[id] - Get quiz by ID with questions
 * PUT /api/quizzes/[id] - Update quiz (owner only)
 * DELETE /api/quizzes/[id] - Delete quiz (owner only)
 */

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Quiz from "@/models/Quiz";
import { requireAuth } from "@/lib/auth-helpers";
import mongoose from "mongoose";

/**
 * 📥 GET /api/quizzes/[id]
 *
 * Get a single quiz with ALL questions
 *
 * RULES:
 * - Public quizzes: anyone can access
 * - Private quizzes: only owner can access
 *
 * NEXT.JS 15: params is now async and must be awaited
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// 🔄 AWAIT PARAMS (Next.js 15 requirement)
		const { id } = await params;

		// 1️⃣ VALIDATE ID FORMAT
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
		}

		// 2️⃣ CHECK IF USER IS LOGGED IN
		const auth = await requireAuth();
		const isLoggedIn = !(auth instanceof NextResponse);
		const userId = isLoggedIn ? auth.user.id : null;

		// 3️⃣ FETCH QUIZ
		await dbConnect();
		const quiz: any = await Quiz.findById(id).lean();

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// 4️⃣ CHECK PERMISSIONS
		const isOwner = isLoggedIn && quiz.ownerId.toString() === userId;

		if (quiz.visibility === "private" && !isOwner) {
			return NextResponse.json(
				{ error: "This quiz is private" },
				{ status: 403 }
			);
		}

		// 5️⃣ RETURN QUIZ (with questions!)
		return NextResponse.json({
			quiz: {
				_id: (quiz as any)._id.toString(), // Use _id to match frontend
				title: quiz.title,
				description: quiz.description,
				questions: quiz.questions,
				visibility: quiz.visibility,
				tags: quiz.tags,
				createdAt: quiz.createdAt,
				updatedAt: quiz.updatedAt,
				isOwner,
			},
		});
	} catch (error) {
		console.error("❌ Get quiz error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch quiz" },
			{ status: 500 }
		);
	}
}

/**
 * 🔄 PUT /api/quizzes/[id]
 *
 * Update a quiz
 *
 * REQUIRED: User must be the owner
 */
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	// 1️⃣ CHECK AUTHENTICATION
	const auth = await requireAuth();
	if (auth instanceof NextResponse) return auth;

	try {
		// 🔄 AWAIT PARAMS (Next.js 15 requirement)
		const { id } = await params;

		// 2️⃣ VALIDATE ID FORMAT
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
		}

		// 3️⃣ PARSE REQUEST BODY
		const body = await request.json();
		const { title, description, questions, visibility, tags } = body;

		// 4️⃣ CONNECT AND FIND QUIZ
		await dbConnect();
		const quiz = await Quiz.findById(id);

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// 5️⃣ CHECK OWNERSHIP (allow admins to edit any quiz)
		const isOwner = quiz.ownerId.toString() === auth.user.id;
		const isAdmin = auth.user.role === "admin";

		if (!isOwner && !isAdmin) {
			return NextResponse.json(
				{ error: "You can only edit your own quizzes" },
				{ status: 403 }
			);
		}

		// 6️⃣ UPDATE FIELDS
		if (title) quiz.title = title;
		if (description !== undefined) quiz.description = description;
		if (questions) quiz.questions = questions;
		if (visibility) quiz.visibility = visibility;
		if (tags) quiz.tags = tags;

		await quiz.save();

		// 7️⃣ RETURN SUCCESS
		return NextResponse.json({
			message: "Quiz updated successfully",
			quiz: {
				id: quiz._id.toString(),
				title: quiz.title,
				description: quiz.description,
				questionCount: quiz.questions.length,
			},
		});
	} catch (error) {
		console.error("❌ Update quiz error:", error);
		return NextResponse.json(
			{ error: "Failed to update quiz" },
			{ status: 500 }
		);
	}
}

/**
 * 🗑️ DELETE /api/quizzes/[id]
 *
 * Delete a quiz
 *
 * REQUIRED: User must be the owner
 */
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	// 1️⃣ CHECK AUTHENTICATION
	const auth = await requireAuth();
	if (auth instanceof NextResponse) return auth;

	try {
		// 🔄 AWAIT PARAMS (Next.js 15 requirement)
		const { id } = await params;

		// 2️⃣ VALIDATE ID FORMAT
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
		}

		// 3️⃣ CONNECT AND FIND QUIZ
		await dbConnect();
		const quiz = await Quiz.findById(id);

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// 4️⃣ CHECK OWNERSHIP (allow admins to delete any quiz)
		const isOwner = quiz.ownerId.toString() === auth.user.id;
		const isAdmin = auth.user.role === "admin";

		if (!isOwner && !isAdmin) {
			return NextResponse.json(
				{ error: "You can only delete your own quizzes" },
				{ status: 403 }
			);
		}

		// 5️⃣ DELETE QUIZ
		await Quiz.findByIdAndDelete(id);

		// 6️⃣ RETURN SUCCESS
		return NextResponse.json({
			message: "Quiz deleted successfully",
		});
	} catch (error) {
		console.error("❌ Delete quiz error:", error);
		return NextResponse.json(
			{ error: "Failed to delete quiz" },
			{ status: 500 }
		);
	}
}
