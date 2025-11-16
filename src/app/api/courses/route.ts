import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Course from "@/models/Course";
import { auth } from "@/lib/auth";
import { CreateCourseSchema } from "@/lib/schemas";
import slugify from "slugify";

export async function GET() {
	await dbConnect();
	const list = await Course.find().sort({ name: 1 }).lean();
	return NextResponse.json(list);
}

export async function POST(req: Request) {
	const session = await auth();
	if (!session?.user?.id)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	await dbConnect();
	const body = await req.json();
	const parsed = CreateCourseSchema.safeParse(body);
	if (!parsed.success)
		return NextResponse.json(parsed.error.format(), { status: 400 });

	const { name, year } = parsed.data;
	const slug = slugify(`${name}-${year}`, { lower: true, strict: true });

	const course = await Course.create({
		name,
		year,
		slug,
		ownerId: session.user.id,
		isGlobal: false,
	});
	return NextResponse.json(course, { status: 201 });
}
