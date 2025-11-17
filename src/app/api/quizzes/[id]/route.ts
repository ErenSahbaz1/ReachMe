import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Quiz, { QuizDoc } from "@/models/Quiz";

import { auth } from "@/lib/auth";
import { CreateQuizSchema } from "@/lib/schemas";
import mongoose from "mongoose";

export async function GET(_: Request, { params }: { params: { id: string } }) {
	await dbConnect();
	if (!mongoose.isValidObjectId(params.id))
		return NextResponse.json({ error: "Bad id" }, { status: 400 });

	const quiz = await Quiz.findById(params.id).lean<QuizDoc>();
	if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

	const session = await auth();
	const isOwner = session?.user?.id === String(quiz.ownerId);
	if (quiz.visibility === "private" && !isOwner) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	return NextResponse.json(quiz);
}

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const session = await auth();
	if (!session?.user?.id)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	await dbConnect();
	const body = await req.json();
	const parsed = CreateQuizSchema.partial().safeParse(body); // allow partial updates
	if (!parsed.success)
		return NextResponse.json(parsed.error.format(), { status: 400 });

	const quiz = await Quiz.findOneAndUpdate(
		{ _id: params.id, ownerId: session.user.id },
		{ $set: { ...parsed.data } },
		{ new: true }
	);
	if (!quiz)
		return NextResponse.json(
			{ error: "Not found or not owner" },
			{ status: 404 }
		);
	return NextResponse.json(quiz);
}

export async function DELETE(
	_: Request,
	{ params }: { params: { id: string } }
) {
	const session = await auth();
	if (!session?.user?.id)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	await dbConnect();
	const res = await Quiz.deleteOne({
		_id: params.id,
		ownerId: session.user.id,
	});
	if (res.deletedCount === 0)
		return NextResponse.json(
			{ error: "Not found or not owner" },
			{ status: 404 }
		);
	return NextResponse.json({ ok: true });
}
