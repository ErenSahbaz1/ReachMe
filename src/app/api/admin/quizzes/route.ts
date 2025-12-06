/**
 * 👑 ADMIN QUIZ MANAGEMENT API
 *
 * GET /api/admin/quizzes - Get all quizzes (admin only)
 */

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Quiz from "@/models/Quiz";

/**
 * GET /api/admin/quizzes
 * Fetch all quizzes with owner info
 * ADMIN ONLY
 */
export async function GET() {
	try {
		// 1️⃣ CHECK AUTHENTICATION
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		// 2️⃣ CONNECT TO DATABASE
		await dbConnect();

		// 3️⃣ CHECK ADMIN ACCESS
		const currentUser = await User.findById(auth.user.id);

		if (!currentUser || currentUser.role !== "admin") {
			return NextResponse.json(
				{ error: "Forbidden - Admin access required" },
				{ status: 403 }
			);
		}

		// 4️⃣ FETCH ALL QUIZZES WITH OWNER INFO
		const quizzes = await Quiz.aggregate([
			{
				$lookup: {
					from: "users",
					localField: "ownerId",
					foreignField: "_id",
					as: "owner",
				},
			},
			{
				$unwind: "$owner",
			},
			{
				$project: {
					_id: 1,
					title: 1,
					description: 1,
					visibility: 1,
					tags: 1,
					createdAt: 1,
					questionCount: { $size: "$questions" },
					ownerName: "$owner.name",
					ownerEmail: "$owner.email",
					ownerId: 1,
				},
			},
			{
				$sort: { createdAt: -1 },
			},
		]);

		// 5️⃣ RETURN DATA
		return NextResponse.json({
			quizzes,
			total: quizzes.length,
		});
	} catch (error) {
		console.error("Admin quizzes fetch error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch quizzes" },
			{ status: 500 }
		);
	}
}
