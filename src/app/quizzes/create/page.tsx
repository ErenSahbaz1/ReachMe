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

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Question {
	text: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

function CreateQuizForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const editId = searchParams.get("edit");
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
	const [loadingQuiz, setLoadingQuiz] = useState(false);
	const [error, setError] = useState("");

	// Load existing quiz if editing
	useEffect(() => {
		if (!editId || !session) return;

		async function loadQuiz() {
			setLoadingQuiz(true);
			try {
				const res = await fetch(`/api/quizzes/${editId}`);
				const data = await res.json();

				if (!res.ok) {
					setError(data.error || "Failed to load quiz");
					setLoadingQuiz(false);
					return;
				}

				const quiz = data.quiz;
				setTitle(quiz.title);
				setDescription(quiz.description || "");
				setTags(quiz.tags.join(", "));
				setVisibility(quiz.visibility);
				setQuestions(quiz.questions);
				setLoadingQuiz(false);
			} catch (err) {
				setError("Failed to load quiz");
				setLoadingQuiz(false);
			}
		}

		loadQuiz();
	}, [editId, session]);

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

			// POST or PUT to API
			const url = editId ? `/api/quizzes/${editId}` : "/api/quizzes";
			const method = editId ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(
					data.error || `Failed to ${editId ? "update" : "create"} quiz`
				);
				setLoading(false);
				return;
			}

			// Success! Go to the quiz page
			router.push(`/quizzes/${editId || data.quiz.id}`);
		} catch (err) {
			setError("Something went wrong");
			setLoading(false);
		}
	}

	return (
		<div className="relative min-h-screen overflow-hidden text-white">
			<div className="fixed inset-0 -z-20 bg-gradient-to-b from-[#0b0b11] via-[#0b0b11] to-[#0b0f1a]" />
			<div className="fixed -left-24 top-6 -z-10 h-[520px] w-[520px] rounded-full bg-[#FF446D]/18 blur-[140px]" />
			<div className="fixed right-[-120px] top-32 -z-10 h-[460px] w-[460px] rounded-full bg-purple-600/16 blur-[140px]" />
			<div className="fixed left-1/3 bottom-[-120px] -z-10 h-[520px] w-[520px] rounded-full bg-cyan-500/12 blur-[160px]" />

			<div className="relative min-h-screen py-24 px-4">
				<div className="max-w-5xl mx-auto relative z-10">
					{/* Header */}
					<div className="mb-10">
						<Link
							href={editId ? "/profile" : "/"}
							className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors group"
						>
							<svg
								className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Back to {editId ? "Profile" : "Home"}
						</Link>
						<div className="flex items-center gap-4 mt-6">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF446D] to-purple-600 flex items-center justify-center shadow-lg shadow-[#FF446D]/25">
								<svg
									className="w-7 h-7 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							</div>
							<div>
								<h1 className="text-4xl font-bold text-white">
									{editId ? "Edit Quiz" : "Create Quiz"}
								</h1>
								<p className="text-white/60 mt-1.5">
									{editId
										? "Update your quiz details and questions"
										: "Create a new quiz for others to learn from"}
								</p>
							</div>
						</div>
					</div>

					{/* Loading Quiz State */}
					{loadingQuiz && (
						<div className="text-center py-12">
							<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF446D]"></div>
							<p className="text-white/70 mt-4">Loading quiz...</p>
						</div>
					)}

					{/* Error */}
					{error && (
						<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg">
							{error}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Basic Info */}
						<div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-lg bg-[#FF446D]/20 border border-[#FF446D]/30 flex items-center justify-center">
									<svg
										className="w-5 h-5 text-[#FF446D]"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h2 className="text-2xl font-bold text-white">
									Basic Information
								</h2>
							</div>

							{/* Title */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-white/90 mb-2">
									Quiz Title *
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									className="w-full px-4 py-3.5 bg-white/5 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#FF446D]/50 focus:border-[#FF446D]/50 outline-none transition-all placeholder:text-white/30"
									placeholder="e.g., JavaScript Fundamentals Quiz"
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
						<div className="bg-white/5 backdrop-blur-xl   rounded-3xl p-6 shadow-sm  border-gray-200">
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

										<h3 className="text-lg font-semibold text-white mb-4">
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
								href={editId ? "/profile" : "/"}
								className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-gray-50 transition"
							>
								Cancel
							</Link>
							<button
								type="submit"
								disabled={loading || loadingQuiz}
								className="px-6 py-3 bg-[#FF446D] text-white rounded-lg font-medium hover:brightness-110 disabled:bg-white/20 disabled:cursor-not-allowed transition"
							>
								{loading
									? editId
										? "Updating..."
										: "Creating..."
									: editId
									? "Update Quiz"
									: "Create Quiz"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default function CreateQuizPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-white">Loading...</div>
				</div>
			}
		>
			<CreateQuizForm />
		</Suspense>
	);
}
