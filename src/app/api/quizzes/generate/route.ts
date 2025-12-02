import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireAuth } from "@/lib/auth-helpers";
import { extractText } from "unpdf";
//test
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
	//CHECK AUTHENTICATION
	const auth = await requireAuth();
	if (auth instanceof NextResponse) return auth;

	//CHECK IF API KEY EXISTS
	if (!process.env.GEMINI_API_KEY) {
		return NextResponse.json(
			{
				error:
					"Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file",
			},
			{ status: 500 }
		);
	}

	try {
		//PARSE REQUEST BODY
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		let content = formData.get("content") as string;
		const questionCount =
			parseInt(formData.get("questionCount") as string) || 5;
		const difficulty = (formData.get("difficulty") as string) || "medium";

		// Handle PDF file if present
		if (file) {
			try {
				console.log("Processing PDF file:", file.name, file.size, "bytes");
				const arrayBuffer = await file.arrayBuffer();
				const uint8Array = new Uint8Array(arrayBuffer);

				console.log("Extracting text from PDF...");
				const data = await extractText(uint8Array);
				content = Array.isArray(data.text) ? data.text.join("\n\n") : data.text;
				console.log("PDF text extracted, length:", content.length);
			} catch (error) {
				console.error("PDF parsing error details:", error);
				console.error(
					"Error type:",
					error instanceof Error ? error.constructor.name : typeof error
				);
				console.error(
					"Error message:",
					error instanceof Error ? error.message : String(error)
				);
				return NextResponse.json(
					{
						error:
							"Failed to read PDF file. Make sure it's a valid PDF with extractable text.",
						details:
							process.env.NODE_ENV === "development"
								? error instanceof Error
									? error.message
									: String(error)
								: undefined,
					},
					{ status: 400 }
				);
			}
		}

		//VALIDATE INPUT
		if (!content || typeof content !== "string" || content.trim() === "") {
			return NextResponse.json(
				{ error: "Content is required. Either upload a PDF or enter text." },
				{ status: 400 }
			);
		}

		if (content.trim().length < 100) {
			return NextResponse.json(
				{
					error: `Content is too short (${
						content.trim().length
					} characters). Please provide at least 100 characters or upload a PDF with more content.`,
				},
				{ status: 400 }
			);
		}

		if (content.length > 100000) {
			content = content.substring(0, 100000);
		}

		if (questionCount < 1 || questionCount > 20) {
			return NextResponse.json(
				{ error: "Question count must be between 1 and 20" },
				{ status: 400 }
			);
		}

		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

		const prompt = `You are an expert quiz creator. Generate ${questionCount} multiple-choice quiz questions based on the following content.

DIFFICULTY LEVEL: ${difficulty}

CONTENT:
${content}

REQUIREMENTS:
1. Create EXACTLY ${questionCount} questions
2. Each question must have 4 options
3. Questions should be clear and unambiguous
4. One option must be correct
5. Include a brief explanation for the correct answer
6. Difficulty should be: ${difficulty}

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "text": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no markdown formatting or extra text
- Ensure questions are relevant to the provided content
- Make sure correctIndex is 0-3 (array index)
- Questions should test understanding, not just memorization

Generate the quiz questions now:`;

		console.log("Generating quiz with Gemini AI...");
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.text();

		console.log("Received AI response");

		let cleanedText = text.trim();

		//Remove markdown code blocks if present
		if (cleanedText.startsWith("```json")) {
			cleanedText = cleanedText
				.replace(/```json\n?/g, "")
				.replace(/```\n?/g, "");
		} else if (cleanedText.startsWith("```")) {
			cleanedText = cleanedText.replace(/```\n?/g, "");
		}

		// Parse JSON
		let aiResponse;
		try {
			aiResponse = JSON.parse(cleanedText);
		} catch (parseError) {
			console.error("Failed to parse AI response:", cleanedText);
			return NextResponse.json(
				{
					error: "AI returned invalid format. Please try again.",
					details:
						process.env.NODE_ENV === "development" ? cleanedText : undefined,
				},
				{ status: 500 }
			);
		}

		if (!aiResponse.questions || !Array.isArray(aiResponse.questions)) {
			return NextResponse.json(
				{ error: "AI response missing questions array" },
				{ status: 500 }
			);
		}

		const questions = aiResponse.questions;

		// Validate each question
		for (let i = 0; i < questions.length; i++) {
			const q = questions[i];

			if (!q.text || typeof q.text !== "string") {
				return NextResponse.json(
					{ error: `Question ${i + 1} is missing or invalid text` },
					{ status: 500 }
				);
			}

			if (!Array.isArray(q.options) || q.options.length !== 4) {
				return NextResponse.json(
					{ error: `Question ${i + 1} must have exactly 4 options` },
					{ status: 500 }
				);
			}

			if (
				typeof q.correctIndex !== "number" ||
				q.correctIndex < 0 ||
				q.correctIndex > 3
			) {
				return NextResponse.json(
					{
						error: `Question ${i + 1} has invalid correctIndex (must be 0-3)`,
					},
					{ status: 500 }
				);
			}

			// Explanation is optional but should be string if present
			if (q.explanation && typeof q.explanation !== "string") {
				q.explanation = String(q.explanation);
			}
		}

		//RETURN VALIDATED QUESTIONS
		console.log(`Successfully generated ${questions.length} questions`);

		return NextResponse.json({
			questions,
			metadata: {
				generatedAt: new Date().toISOString(),
				questionCount: questions.length,
				difficulty,
				model: "gemini-2.5-flash-lite",
			},
		});
	} catch (error) {
		console.error("AI Generation error:", error);

		// Handle specific Gemini API errors
		if ((error as any).message?.includes("API_KEY_INVALID")) {
			return NextResponse.json(
				{ error: "Invalid Gemini API key. Please check your configuration." },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				error: "Failed to generate quiz",
				details:
					process.env.NODE_ENV === "development"
						? (error as Error).message
						: undefined,
			},
			{ status: 500 }
		);
	}
}
