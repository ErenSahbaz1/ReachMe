/**
 * 🎯 SINGLE QUIZ ENDPOINT
 *
 * GET /api/quizzes/[id] - Get quiz by ID with questions
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
