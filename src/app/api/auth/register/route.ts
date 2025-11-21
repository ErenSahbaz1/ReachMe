import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
	try {
		const { email, password, name } = await request.json();
		if (!email || !password || !name) {
			return NextResponse.json(
				{ error: "All fields required" },
				{ status: 400 }
			);
		}
		if (password.length < 8) {
			return NextResponse.json(
				{ error: "Password must be 8+ characters" },
				{ status: 400 }
			);
		}
		await dbConnect();
		const existing = await User.findOne({ email: email.toLowerCase() });
		if (existing) {
			return NextResponse.json(
				{ error: "Email already registered" },
				{ status: 409 }
			);
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({
			email: email.toLowerCase(),
			name,
			passwordHash,
		});
		return NextResponse.json(
			{
				message: "User created",
				user: { id: user._id.toString(), email: user.email, name: user.name },
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Registration error:", error);
		if ((error as any).code === 11000) {
			return NextResponse.json(
				{ error: "Email already registered" },
				{ status: 409 }
			);
		}
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
