/**
 * 👑 ADMIN USER MANAGEMENT API
 *
 * GET /api/admin/users - Get all users with stats (admin only)
 */

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

/**
 * GET /api/admin/users
 * Fetch all users with their quiz counts
 * ADMIN ONLY
 */
export async function GET() {
	try {
		// 1️⃣ CHECK AUTHENTICATION
		const auth = await requireAuth();
		if (auth instanceof NextResponse) return auth;

		// 2️⃣ CONNECT TO DATABASE
		await dbConnect();

		// 3️⃣ CHECK ADMIN ACCESS - Use role from database
		const currentUser = await User.findById(auth.user.id);

		if (!currentUser || currentUser.role !== "admin") {
			return NextResponse.json(
				{ error: "Forbidden - Admin access required" },
				{ status: 403 }
			);
		}

		// 4️⃣ FETCH ALL USERS WITH STATS using aggregation
		const users = await User.aggregate([
			{
				$lookup: {
					from: "quizzes",
					localField: "_id",
					foreignField: "ownerId",
					as: "quizzes",
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					email: 1,
					role: 1,
					image: 1,
					createdAt: 1,
					quizCount: { $size: "$quizzes" },
				},
			},
			{
				$sort: { createdAt: -1 },
			},
		]);

		// 5️⃣ RETURN DATA
		return NextResponse.json({
			users,
			total: users.length,
		});
	} catch (error) {
		console.error("Admin users fetch error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch users" },
			{ status: 500 }
		);
	}
}
