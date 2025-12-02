import { GoogleGenerativeAI } from "@google/generative-ai";
import { tr } from "motion/react-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { questionText, options, correctIndex, userAnswer } =
			await request.json();

		if (!questionText || !options || correctIndex === undefined) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}
		if (!process.env.GEMINI_API_KEY) {
			return NextResponse.json(
				{ error: "AI service is not configured" },
				{ status: 500 }
			);
		}
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

		const correctAnswer = options[correctIndex];
		const userAnswerText =
			userAnswer !== undefined ? options[userAnswer] : null;

		const prompt = `
You are a helpful tutor explaining quiz answers to students.

Question: ${questionText}

Options:
${options.map((opt: string, i: number) => `${i + 1}. ${opt}`).join("\n")}

Correct Answer: ${correctAnswer}
${userAnswerText ? `Student's Answer: ${userAnswerText}` : ""}

Provide a clear, educational explanation of why "${correctAnswer}" is the correct answer.
${
	userAnswerText && userAnswerText !== correctAnswer
		? `Also briefly explain why "${userAnswerText}" is incorrect.`
		: ""
}

Keep your explanation:
- Clear and concise (2-4 sentences)
- Educational and encouraging
- Easy to understand for beginners
`;

		console.log("Generating explain answer");
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const explanation = response.text();
		console.log("Explanation received by Gemini");
		return NextResponse.json({ explanation });
	} catch (error) {
		console.error("AI Explain Error:", error);
		return NextResponse.json(
			{ error: "Failed to generate explanation" },
			{ status: 500 }
		);
	}
}
