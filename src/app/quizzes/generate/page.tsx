"use client";


import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
	text: string;
	options: string[];
	correctIndex: number;
	explanation?: string;
}

export default function GenerateQuizPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	// Form state
	const [content, setContent] = useState("");
	const [questionCount, setQuestionCount] = useState(5);
	const [difficulty, setDifficulty] = useState("medium");

	// Generation state
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState("");

	// Generated quiz state
	const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
	const [showPreview, setShowPreview] = useState(false);

	// Edit mode for final quiz details
	const [quizTitle, setQuizTitle] = useState("");
	const [quizDescription, setQuizDescription] = useState("");
	const [quizTags, setQuizTags] = useState("");
	const [visibility, setVisibility] = useState<"public" | "private">("public");
	const [saving, setSaving] = useState(false);

	// Redirect if not logged in
	if (status === "loading") {
		return (
			<div className="min-h-screen bg-[#111111] flex items-center justify-center">
				<div className="text-white/70">Loading...</div>
			</div>
		);
	}

	if (!session) {
		router.push("/signin");
		return null;
	}


	async function handleGenerate() {
		setError("");
		setGenerating(true);

		try {
			const res = await fetch("/api/quizzes/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					content,
					questionCount,
					difficulty,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to generate quiz");
				setGenerating(false);
				return;
			}

			// Success! Show the generated questions
			setGeneratedQuestions(data.questions);
			setShowPreview(true);
			setGenerating(false);
		} catch (err) {
			setError("Something went wrong. Please try again.");
			setGenerating(false);
		}
	}

	/**
	 *SAVE QUIZ TO DATABASE
	 */
	async function handleSave() {
		if (!quizTitle.trim()) {
			setError("Please enter a quiz title");
			return;
		}

		if (generatedQuestions.length === 0) {
			setError("No questions to save");
			return;
		}

		setSaving(true);
		setError("");

		try {
			const res = await fetch("/api/quizzes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: quizTitle,
					description: quizDescription,
					questions: generatedQuestions,
					visibility,
					tags: quizTags
						.split(",")
						.map((t) => t.trim())
						.filter(Boolean),
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to save quiz");
				setSaving(false);
				return;
			}

			// Success! Redirect to the quiz
			router.push(`/quizzes/${data.quiz.id}`);
		} catch (err) {
			setError("Failed to save quiz");
			setSaving(false);
		}
	}

	
	function handleReset() {
		setShowPreview(false);
		setGeneratedQuestions([]);
		setQuizTitle("");
		setQuizDescription("");
		setQuizTags("");
		setError("");
	}

	
	function handleEditQuestion(
		index: number,
		field: keyof Question,
		value: any
	) {
		const updated = [...generatedQuestions];
		updated[index] = { ...updated[index], [field]: value };
		setGeneratedQuestions(updated);
	}

	
	function handleDeleteQuestion(index: number) {
		const updated = generatedQuestions.filter((_, i) => i !== index);
		setGeneratedQuestions(updated);
	}

	
	if (showPreview) {
		return (
			<div className="relative min-h-screen bg-[#111111] py-12 px-4">
				
				<div className="max-w-4xl mx-auto relative z-10">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-white mb-2">
							Review AI-Generated Quiz
						</h1>
						<p className="text-white/70">
							Edit the questions below, then save your quiz
						</p>
					</div>

					{/* Quiz Details Form */}
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 mb-8">
						<h2 className="text-2xl font-bold text-white mb-6">Quiz Details</h2>

						<div className="space-y-6">
							{/* Title */}
							<div>
								<label className="block text-white/90 font-medium mb-2">
									Quiz Title *
								</label>
								<input
									type="text"
									value={quizTitle}
									onChange={(e) => setQuizTitle(e.target.value)}
									placeholder="e.g., JavaScript Fundamentals Quiz"
									className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D]"
									required
								/>
							</div>

							{/* Description */}
							<div>
								<label className="block text-white/90 font-medium mb-2">
									Description
								</label>
								<textarea
									value={quizDescription}
									onChange={(e) => setQuizDescription(e.target.value)}
									placeholder="What is this quiz about?"
									rows={3}
									className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D]"
								/>
							</div>

							{/* Tags */}
							<div>
								<label className="block text-white/90 font-medium mb-2">
									Tags (comma separated)
								</label>
								<input
									type="text"
									value={quizTags}
									onChange={(e) => setQuizTags(e.target.value)}
									placeholder="e.g., javascript, programming, beginner"
									className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D]"
								/>
							</div>

							{/* Visibility */}
							<div>
								<label className="block text-white/90 font-medium mb-3">
									Visibility
								</label>
								<div className="flex gap-4">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="visibility"
											value="public"
											checked={visibility === "public"}
											onChange={(e) =>
												setVisibility(e.target.value as "public" | "private")
											}
											className="w-4 h-4 text-[#FF446D]"
										/>
										<span className="text-white/90">Public</span>
									</label>
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="visibility"
											value="private"
											checked={visibility === "private"}
											onChange={(e) =>
												setVisibility(e.target.value as "public" | "private")
											}
											className="w-4 h-4 text-[#FF446D]"
										/>
										<span className="text-white/90">Private</span>
									</label>
								</div>
							</div>
						</div>
					</div>

					{/* Generated Questions */}
					<div className="space-y-6 mb-8">
						<h2 className="text-2xl font-bold text-white">
							Questions ({generatedQuestions.length})
						</h2>

						{generatedQuestions.map((q, index) => (
							<div
								key={index}
								className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
							>
								<div className="flex items-start justify-between mb-4">
									<span className="text-white/50 font-semibold">
										Question {index + 1}
									</span>
									<button
										onClick={() => handleDeleteQuestion(index)}
										className="text-red-400 hover:text-red-300 text-sm"
									>
										Delete
									</button>
								</div>

								{/* Question Text */}
								<div className="mb-4">
									<label className="block text-white/70 text-sm mb-2">
										Question
									</label>
									<input
										type="text"
										value={q.text}
										onChange={(e) =>
											handleEditQuestion(index, "text", e.target.value)
										}
										className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D]"
									/>
								</div>

								{/* Options */}
								<div className="mb-4">
									<label className="block text-white/70 text-sm mb-2">
										Options
									</label>
									{q.options.map((option, oIndex) => (
										<div key={oIndex} className="flex items-center gap-3 mb-2">
											<input
												type="radio"
												name={`correct-${index}`}
												checked={q.correctIndex === oIndex}
												onChange={() =>
													handleEditQuestion(index, "correctIndex", oIndex)
												}
												className="w-4 h-4"
											/>
											<input
												type="text"
												value={option}
												onChange={(e) => {
													const newOptions = [...q.options];
													newOptions[oIndex] = e.target.value;
													handleEditQuestion(index, "options", newOptions);
												}}
												className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D]"
											/>
										</div>
									))}
								</div>

								{/* Explanation */}
								<div>
									<label className="block text-white/70 text-sm mb-2">
										Explanation (optional)
									</label>
									<textarea
										value={q.explanation || ""}
										onChange={(e) =>
											handleEditQuestion(index, "explanation", e.target.value)
										}
										rows={2}
										className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D]"
									/>
								</div>
							</div>
						))}
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-300">
							{error}
						</div>
					)}

					{/* Actions */}
					<div className="flex gap-4">
						<button
							onClick={handleSave}
							disabled={saving}
							className="flex-1 bg-[#FF446D] text-white py-4 rounded-lg font-semibold hover:brightness-110 disabled:opacity-50 transition"
						>
							{saving ? "Saving..." : "Save Quiz"}
						</button>
						<button
							onClick={handleReset}
							disabled={saving}
							className="px-8 py-4 bg-white/10 text-white/90 rounded-lg font-semibold hover:bg-white/20 transition"
						>
							Start Over
						</button>
					</div>
				</div>
			</div>
		);
	}


	return (
		<div className="relative min-h-screen bg-[#111111] py-12 px-4">
			
			<div className="max-w-3xl mx-auto relative z-10">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/"
						className="text-[#FF446D] hover:text-[#FF446D]/80 mb-4 inline-flex items-center gap-2"
					>
						← Back to Home
					</Link>
					<h1 className="text-4xl font-bold text-white mb-2">
						Generate Quiz with AI
					</h1>
					<p className="text-white/70">
						Paste your course content or topic description, and let AI create
						quiz questions for you!
					</p>
				</div>

				{/* Generation Form */}
				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
					{/* Content Input */}
					<div className="mb-6">
						<label className="block text-white/90 font-medium mb-2">
							Content / Topic Description *
						</label>
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Paste your course notes, lecture content, or topic description here. The more detailed, the better the questions! (minimum 100 characters)"
							rows={12}
							className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D] placeholder:text-white/40"
							required
						/>
						<p className="text-white/50 text-sm mt-2">
							{content.length} characters (minimum 100 required)
						</p>
					</div>

					{/* Settings Row */}
					<div className="grid md:grid-cols-2 gap-6 mb-6">
						{/* Question Count */}
						<div>
							<label className="block text-white/90 font-medium mb-2">
								Number of Questions
							</label>
							<input
								type="number"
								min="1"
								max="20"
								value={questionCount}
								onChange={(e) => setQuestionCount(parseInt(e.target.value))}
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D]"
							/>
						</div>

						{/* Difficulty */}
						<div>
							<label className="block text-white/90 font-medium mb-2">
								Difficulty Level
							</label>
							<select
								value={difficulty}
								onChange={(e) => setDifficulty(e.target.value)}
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D]"
							>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
						</div>
					</div>

					{/* Info Box */}
					<div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
						<p className="text-cyan-200 text-sm">
							💡 <strong>Tip:</strong> AI works best with clear, well-structured
							content. Include key concepts, definitions, and examples for
							better question quality.
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-300">
							{error}
						</div>
					)}

					{/* Generate Button */}
					<button
						onClick={handleGenerate}
						disabled={generating || content.length < 100}
						className="w-full bg-[#FF446D] text-white py-4 rounded-lg font-semibold text-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-3"
					>
						{generating ? (
							<>
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
								<span>Generating with AI... (this may take 10-15 seconds)</span>
							</>
						) : (
							<>
								<span>🤖</span>
								<span>Generate Quiz Questions</span>
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
