import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Quiz from "@/models/Quiz";
import { auth } from "@/lib/auth";
import { CreateQuizSchema } from "@/lib/schemas";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const visibility = searchParams.get("visibility") ?? "public";
  const year = searchParams.get("year") ?? undefined;
  const courseId = searchParams.get("courseId") ?? undefined;

  const q: any = {};
  if (visibility === "public") q.visibility = "public";
  if (year) q.year = year;
  if (courseId) q.courseId = courseId;

  const quizzes = await Quiz.find(q).sort({ createdAt: -1 }).select("-questions").lean();
  return NextResponse.json(quizzes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const body = await req.json();
  const parsed = CreateQuizSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.format(), { status: 400 });

  const quiz = await Quiz.create({
    ...parsed.data,
    ownerId: session.user.id
  });
  return NextResponse.json(quiz, { status: 201 });
}
