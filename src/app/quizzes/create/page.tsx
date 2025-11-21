"use client";

/**
 * ðŸ“ CREATE QUIZ PAGE
 *
 * This page allows authenticated users to create new quizzes.
 *
 * FORM FEATURES:
 * - Title, description, tags
 * - Dynamic question list (add/remove)
 * - Multiple choice options
 * - Mark correct answer
 * - Explanation for each question
 *
 * LEARNING: Dynamic form arrays
 * - Use array state for questions
 * - Map over array to render inputs
 * - Add/remove items dynamically
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Question {
	text: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export default function CreateQuizPage() {
	const router = useRouter();
	const { data: session, status } = useSession();

	// Form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState("");
	const [visibility, setVisibility] = useState<"public" | "private">("public");
	const [questions, setQuestions] = useState<Question[]>([
		{
			text: "",
			options: ["", "", "", ""],
			correctIndex: 0,
			explanation: "",
		},
	]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Redirect if not authenticated
	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	if (status === "unauthenticated") {
		router.push("/signin");
		return null;
	}

	/**
	 * Add a new question to the form
	 */
	function addQuestion() {
		setQuestions([
			...questions,
			{
				text: "",
				options: ["", "", "", ""],
				correctIndex: 0,
				explanation: "",
			},
		]);
	}

	/**
	 * Remove a question
	 */
	function removeQuestion(index: number) {
		if (questions.length === 1) {
			setError("Quiz must have at least one question");
			return;
		}
		setQuestions(questions.filter((_, i) => i !== index));
	}

	/**
	 * Update a question field
	 */
	function updateQuestion(
		index: number,
		field: keyof Question,
		value: string | number
	) {
		const updated = [...questions];
		(updated[index][field] as any) = value;
		setQuestions(updated);
	}

	/**
	 * Update an option in a question
	 */
	function updateOption(qIndex: number, oIndex: number, value: string) {
		const updated = [...questions];
		updated[qIndex].options[oIndex] = value;
		setQuestions(updated);
	}

	/**
	 * Submit the quiz
	 */
	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			// Validate
			if (questions.some((q) => !q.text || q.options.some((o) => !o))) {
				setError("All questions and options must be filled");
				setLoading(false);
				return;
			}

			// Validate question length
			const shortQuestion = questions.find((q) => q.text.trim().length < 5);
			if (shortQuestion) {
				setError("Each question must be at least 5 characters long");
				setLoading(false);
				return;
			}

			// Validate option length
			const emptyOption = questions.find((q) =>
				q.options.some((o) => o.trim().length === 0)
			);
			if (emptyOption) {
				setError("All options must be filled");
				setLoading(false);
				return;
			}

			// Build payload
			const payload = {
				title,
				description,
				tags: tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
				visibility,
				questions,
			};

			// POST to API
			const res = await fetch("/api/quizzes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to create quiz");
				setLoading(false);
				return;
			}

			// Success! Go to the quiz page
			router.push(`/quizzes/${data.quiz._id}`);
		} catch (err) {
			setError("Something went wrong");
			setLoading(false);
		}
	}

	return (
		<div className="relative min-h-screen bg-[#111111] py-12 px-4">
			{/* Background Glows */}
			<div
				className="absolute -z-10 left-1/4 top-12 w-[480px] h-[480px] rounded-full opacity-70 blur-3xl pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, #FF446D 0%, rgba(255,68,109,0.25) 40%, transparent 70%)",
				}}
			/>
			<div
				className="absolute -z-20 right-0 top-40 w-[360px] h-[360px] rounded-full opacity-60 blur-2xl pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, #7C3AED 0%, rgba(124,58,237,0.2) 40%, transparent 70%)",
				}}
			/>
			<div
				className="absolute -z-30 left-[-80px] bottom-20 w-[520px] h-[520px] rounded-full opacity-50 blur-3xl pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, #06B6D4 0%, rgba(6,182,212,0.12) 40%, transparent 70%)",
				}}
			/>

			<div className="max-w-4xl mx-auto relative z-10">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/"
						className="text-[#FF446D] hover:brightness-110 text-sm font-medium transition"
					>
						â† Back to Home
					</Link>
					<h1 className="text-4xl font-bold text-white mt-4">Create Quiz</h1>
					<p className="text-white/70 mt-2">
						Create a new quiz for others to learn from
					</p>
				</div>

				{/* Error */}
				{error && (
					<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg">
						{error}
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Basic Info */}
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
						<h2 className="text-xl font-bold text-white mb-4">
							Basic Information
						</h2>

						{/* Title */}
						<div className="mb-4">
							<label className="block text-sm font-medium text-white/90 mb-2">
								Title *
							</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#FF446D] focus:border-transparent outline-none"
								placeholder="e.g., JavaScript Basics"
							/>
						</div>

						{/* Description */}
						<div className="mb-4">
							<label className="block text-sm font-medium text-white/90 mb-2">
								Description *
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
								rows={3}
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#FF446D] focus:border-transparent outline-none resize-none"
								placeholder="What will students learn?"
							/>
						</div>

						{/* Tags */}
						<div className="mb-4">
							<label className="block text-sm font-medium text-white/90 mb-2">
								Tags (comma-separated)
							</label>
							<input
								type="text"
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#FF446D] focus:border-transparent outline-none"
								placeholder="e.g., JavaScript, Web Development, Beginner"
							/>
						</div>

						{/* Visibility */}
						<div>
							<label className="block text-sm font-medium text-white/90 mb-2">
								Visibility
							</label>
							<div className="flex gap-4">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										value="public"
										checked={visibility === "public"}
										onChange={(e) => setVisibility(e.target.value as any)}
										className="w-4 h-4 text-indigo-600"
									/>
									<span className="text-sm text-white/90">Public</span>
								</label>
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										value="private"
										checked={visibility === "private"}
										onChange={(e) => setVisibility(e.target.value as any)}
										className="w-4 h-4 text-indigo-600"
									/>
									<span className="text-sm text-white/90">Private</span>
								</label>
							</div>
						</div>
					</div>

					{/* Questions */}
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-sm border border-gray-200">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-white">Questions</h2>
							<button
								type="button"
								onClick={addQuestion}
								className="px-4 py-2 bg-[#FF446D] text-white rounded-lg text-sm font-medium hover:brightness-110 transition"
							>
								+ Add Question
							</button>
						</div>

						{/* Question List */}
						<div className="space-y-6">
							{questions.map((question, qIndex) => (
								<div
									key={qIndex}
									className="border border-white/10 rounded-lg bg-white/5 p-6 relative"
								>
									{/* Remove Button */}
									{questions.length > 1 && (
										<button
											type="button"
											onClick={() => removeQuestion(qIndex)}
											className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-sm font-medium"
										>
											Remove
										</button>
									)}

									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										Question {qIndex + 1}
									</h3>

									{/* Question Text */}
									<div className="mb-4">
										<label className="block text-sm font-medium text-white/90 mb-2">
											Question Text *
										</label>
										<input
											type="text"
											value={question.text}
											onChange={(e) =>
												updateQuestion(qIndex, "text", e.target.value)
											}
											required
											minLength={5}
											className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#FF446D] outline-none"
											placeholder="Enter your question (minimum 5 characters)"
										/>
										<p className="text-xs text-white/50 mt-1">
											{question.text.length}/5 characters minimum
										</p>
									</div>

									{/* Options */}
									<div className="mb-4">
										<label className="block text-sm font-medium text-white/90 mb-2">
											Options *
										</label>
										<div className="space-y-2">
											{question.options.map((option, oIndex) => (
												<div key={oIndex} className="flex items-center gap-3">
													<input
														type="radio"
														name={`correct-${qIndex}`}
														checked={question.correctIndex === oIndex}
														onChange={() =>
															updateQuestion(qIndex, "correctIndex", oIndex)
														}
														className="w-4 h-4 text-green-400"
													/>
													<input
														type="text"
														value={option}
														onChange={(e) =>
															updateOption(qIndex, oIndex, e.target.value)
														}
														required
														className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#FF446D] outline-none text-sm"
														placeholder={`Option ${oIndex + 1}`}
													/>
												</div>
											))}
										</div>
										<p className="text-xs text-gray-500 mt-2">
											Select the radio button for the correct answer
										</p>
									</div>

									{/* Explanation */}
									<div>
										<label className="block text-sm font-medium text-white/90 mb-2">
											Explanation
										</label>
										<textarea
											value={question.explanation}
											onChange={(e) =>
												updateQuestion(qIndex, "explanation", e.target.value)
											}
											rows={2}
											className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#FF446D] outline-none resize-none text-sm"
											placeholder="Explain why this is the correct answer"
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Submit */}
					<div className="flex justify-end gap-4">
						<Link
							href="/"
							className="px-6 py-3 bg-white/10 border border-white/20 text-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
						>
							Cancel
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-3 bg-[#FF446D] text-white rounded-lg font-medium hover:brightness-110 disabled:bg-white/20 disabled:cursor-not-allowed transition"
						>
							{loading ? "Creating..." : "Create Quiz"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
