/**
 * 📝 QUIZ ENDPOINTS
 *
 * POST /api/quizzes - Create new quiz (auth required)
 * GET /api/quizzes - List quizzes (public + your private ones)
 */

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Quiz from "@/models/Quiz";
import { requireAuth } from "@/lib/auth-helpers";

/**
 * 📤 POST /api/quizzes
 *
 * Create a new quiz
 *
 * REQUIRED: User must be logged in
 *
 * BODY:
 * {
 *   title: "JavaScript Basics",
 *   description: "Test your JS knowledge",
 *   questions: [
 *     {
 *       text: "What is 2+2?",
 *       options: ["3", "4", "5"],
 *       correctIndex: 1,
 *       explanation: "Basic math!"
 *     }
 *   ],
 *   visibility: "public",
 *   tags: ["javascript", "basics"]
 * }
 */
export async function POST(request: Request) {
	// 1️⃣ CHECK AUTHENTICATION
	const auth = await requireAuth();
	if (auth instanceof NextResponse) return auth; // Not logged in

	try {
		// 2️⃣ PARSE REQUEST BODY
		const body = await request.json();
		const { title, description, questions, visibility, tags } = body;

		// 3️⃣ BASIC VALIDATION
		if (!title || !questions || !Array.isArray(questions)) {
			return NextResponse.json(
				{ error: "Title and questions array are required" },
				{ status: 400 }
			);
		}

		if (questions.length === 0) {
			return NextResponse.json(
				{ error: "Quiz must have at least 1 question" },
				{ status: 400 }
			);
		}

		// 4️⃣ VALIDATE EACH QUESTION
		for (let i = 0; i < questions.length; i++) {
			const q = questions[i];
			if (!q.text || !q.options || q.correctIndex === undefined) {
				return NextResponse.json(
					{ error: `Question ${i + 1} is missing required fields` },
					{ status: 400 }
				);
			}
			if (q.correctIndex >= q.options.length || q.correctIndex < 0) {
				return NextResponse.json(
					{ error: `Question ${i + 1} has invalid correctIndex` },
					{ status: 400 }
				);
			}
		}

		// 5️⃣ CONNECT TO DATABASE
		await dbConnect();

		// 6️⃣ CREATE QUIZ
		const quiz = await Quiz.create({
			ownerId: auth.user.id,
			title,
			description,
			questions,
			visibility: visibility || "public",
			tags: tags || [],
		});

		// 7️⃣ RETURN SUCCESS
		return NextResponse.json(
			{
				message: "Quiz created successfully",
				quiz: {
					id: quiz._id.toString(),
					title: quiz.title,
					description: quiz.description,
					questionCount: quiz.questions.length,
					visibility: quiz.visibility,
					tags: quiz.tags,
					createdAt: quiz.createdAt,
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("❌ Create quiz error:", error);
		return NextResponse.json(
			{ error: "Failed to create quiz", details: (error as Error).message },
			{ status: 500 }
		);
	}
}

/**
 * 📥 GET /api/quizzes
 *
 * List quizzes
 *
 * LOGIC:
 * - If NOT logged in: show only public quizzes
 * - If logged in: show public quizzes + your private quizzes
 *
 * QUERY PARAMS (optional):
 * - ?limit=10 (default: 20)
 * - ?page=1 (for pagination)
 * - ?tags=javascript,react (filter by tags)
 */
export async function GET(request: Request) {
	try {
		// 1️⃣ CHECK IF USER IS LOGGED IN (optional for GET)
		const auth = await requireAuth();
		const isLoggedIn = !(auth instanceof NextResponse);
		const userId = isLoggedIn ? auth.user.id : null;

		// 2️⃣ PARSE QUERY PARAMS
		const { searchParams } = new URL(request.url);
		const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
		const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
		const tagsParam = searchParams.get("tags");
		const tags = tagsParam ? tagsParam.split(",") : [];

		// 3️⃣ BUILD QUERY
		await dbConnect();

		const query: any = {};

		// Show public quizzes OR user's own quizzes
		if (isLoggedIn) {
			query.$or = [{ visibility: "public" }, { ownerId: userId }];
		} else {
			query.visibility = "public";
		}

		// Filter by tags if provided
		if (tags.length > 0) {
			query.tags = { $in: tags };
		}

		// 4️⃣ EXECUTE QUERY
		const quizzes = await Quiz.find(query)
			.select("title description visibility tags createdAt ownerId questions") // Include questions to count them
			.sort({ createdAt: -1 }) // Newest first
			.limit(limit)
			.skip((page - 1) * limit)
			.lean(); // Convert to plain objects (faster)

		const total = await Quiz.countDocuments(query);

		// 5️⃣ RETURN RESULTS
		return NextResponse.json({
			quizzes: quizzes.map((q: any) => ({
				_id: q._id.toString(), // Use _id to match frontend expectation
				title: q.title,
				description: q.description,
				visibility: q.visibility,
				tags: q.tags,
				questionCount: q.questions?.length || 0, // Add question count
				createdAt: q.createdAt,
				isOwner: isLoggedIn && q.ownerId.toString() === userId,
			})),
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("❌ List quizzes error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch quizzes" },
			{ status: 500 }
		);
	}
}
