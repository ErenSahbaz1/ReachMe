"use client";

/**
 * 🎯 QUIZ DETAIL/PLAY PAGE
 *
 * This page:
 * 1. Fetches a single quiz by ID
 * 2. Shows questions one at a time
 * 3. Tracks user answers
 * 4. Shows results at the end
 *
 * KEY CONCEPTS:
 * - Dynamic routes: [id] in folder name
 * - State management for quiz flow
 * - Conditional rendering (quiz vs results)
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
	text: string;
	options: string[];
	correctIndex: number;
	explanation?: string;
}

interface Quiz {
	_id: string;
	title: string;
	description: string;
	tags: string[];
	questions: Question[];
	visibility: string;
}

export default function QuizDetailPage() {
	const params = useParams();
	const router = useRouter();
	const quizId = params.id as string;
	const [aiExplanations, setAiExplanations] = useState<{
		[key: number]: string;
	}>({});
	const [loadingExplanation, setLoadingExplanation] = useState<number | null>(
		null
	);
	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Quiz flow state
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [userAnswers, setUserAnswers] = useState<number[]>([]);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [showResults, setShowResults] = useState(false);

	// Fetch quiz on mount
	useEffect(() => {
		async function fetchQuiz() {
			try {
				const res = await fetch(`/api/quizzes/${quizId}`);
				const data = await res.json();

				if (!res.ok) {
					setError(data.error || "Failed to load quiz");
					setLoading(false);
					return;
				}

				setQuiz(data.quiz);
				setLoading(false);
			} catch (err) {
				setError("Something went wrong");
				setLoading(false);
			}
		}
		fetchQuiz();
	}, [quizId]);

	async function explainWithAI(questionIndex: number) {
		// Prevent multiple clicks
		if (loadingExplanation === questionIndex || aiExplanations[questionIndex])
			return;

		setLoadingExplanation(questionIndex);

		try {
			const question = quiz!.questions[questionIndex];
			const userAnswer = userAnswers[questionIndex];

			const res = await fetch("/api/ai/explain", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					questionText: question.text,
					options: question.options,
					correctIndex: question.correctIndex,
					userAnswer: userAnswer,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				setAiExplanations((prev) => ({
					...prev,
					[questionIndex]: data.explanation,
				}));
			} else {
				alert("Failed to get explanation: " + data.error);
			}
		} catch (error) {
			console.error("Error fetching explanation:", error);
		} finally {
			setLoadingExplanation(null);
		}
	}

	/**
	 * Handle answer selection
	 */
	function handleSelectAnswer(index: number) {
		setSelectedAnswer(index);
	}

	/**
	 * Go to next question or show results
	 */
	function handleNext() {
		if (selectedAnswer === null) return;

		// Save the answer
		const newAnswers = [...userAnswers, selectedAnswer];
		setUserAnswers(newAnswers);
		setSelectedAnswer(null);

		// Check if this was the last question
		if (quiz && currentQuestion + 1 >= quiz.questions.length) {
			setShowResults(true);
		} else {
			setCurrentQuestion(currentQuestion + 1);
		}
	}

	/**
	 * Calculate score
	 */
	function calculateScore() {
		if (!quiz) return { correct: 0, total: 0, percentage: 0 };

		let correct = 0;
		quiz.questions.forEach((q, i) => {
			if (userAnswers[i] === q.correctIndex) {
				correct++;
			}
		});

		const total = quiz.questions.length;
		const percentage = Math.round((correct / total) * 100);

		return { correct, total, percentage };
	}

	/**
	 * Restart the quiz
	 */
	function handleRestart() {
		setCurrentQuestion(0);
		setUserAnswers([]);
		setSelectedAnswer(null);
		setShowResults(false);
	}

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen bg-[#111111] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF446D] mx-auto mb-4"></div>
					<p className="text-white/70">Loading quiz...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !quiz) {
		return (
			<div className="relative min-h-screen bg-[#111111] flex items-center justify-center px-4">
				{/* Background Glows */}
				<div
					className="absolute -z-10 left-1/4 top-12 w-[480px] h-[480px] rounded-full opacity-70 blur-3xl pointer-events-none"
					style={{
						background:
							"radial-gradient(circle, #FF446D 0%, rgba(255,68,109,0.25) 40%, transparent 70%)",
					}}
				/>
				<div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 text-center relative z-10">
					<div className="text-red-400 text-5xl mb-4">⚠️</div>
					<h1 className="text-2xl font-bold text-white mb-2">Quiz Not Found</h1>
					<p className="text-white/70 mb-6">
						{error ||
							"This quiz doesn't exist or you don't have permission to view it."}
					</p>
					<Link
						href="/"
						className="inline-block bg-[#FF446D] text-white px-6 py-3 rounded-lg font-medium hover:brightness-110 transition"
					>
						Back to Home
					</Link>
				</div>
			</div>
		);
	}

	// Results view
	if (showResults) {
		const score = calculateScore();
		const passed = score.percentage >= 70;

		return (
			<div className="relative min-h-screen bg-[#111111] py-12 px-4">
				{/* Background Glows */}
				<div className="max-w-4xl mx-auto relative z-10">
					{/* Results Card */}
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 mb-8">
						{/* Score Circle */}
						<div className="text-center mb-8">
							<div
								className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${
									passed
										? "bg-green-500/20 text-green-300"
										: "bg-red-500/20 text-red-300"
								}`}
							>
								{score.percentage}%
							</div>
							<h1 className="text-3xl font-bold text-white mt-6">
								{passed ? "Great Job! 🎉" : "Keep Practicing! 💪"}
							</h1>
							<p className="text-white/70 mt-2">
								You got {score.correct} out of {score.total} questions correct
							</p>
						</div>

						{/* Question Review */}
						<div className="space-y-6">
							<h2 className="text-xl font-bold text-white border-b border-white/10 pb-3">
								Review Answers
							</h2>
							{quiz.questions.map((q, i) => {
								const userAnswer = userAnswers[i];
								const isCorrect = userAnswer === q.correctIndex;

								return (
									<div
										key={i}
										className="border border-white/10 bg-white/5 rounded-lg p-6"
									>
										<div className="flex items-start gap-3 mb-4">
											<span
												className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
													isCorrect
														? "bg-green-500/20 text-green-300"
														: "bg-red-500/20 text-red-300"
												}`}
											>
												{isCorrect ? "✓" : "✗"}
											</span>
											<div className="flex-1">
												<h3 className="font-semibold text-white mb-3">
													{i + 1}. {q.text}
												</h3>

												{/* Options */}
												<div className="space-y-2">
													{q.options.map((option, oIndex) => {
														const isUserAnswer = userAnswer === oIndex;
														const isCorrectAnswer = q.correctIndex === oIndex;

														return (
															<div
																key={oIndex}
																className={`p-3 rounded-lg border ${
																	isCorrectAnswer
																		? "bg-green-500/10 border-green-500/50"
																		: isUserAnswer
																		? "bg-red-500/10 border-red-500/50"
																		: "bg-white/5 border-white/10"
																}`}
															>
																<div className="flex items-center gap-2">
																	{isCorrectAnswer && (
																		<span className="text-green-400 font-bold">
																			✓
																		</span>
																	)}
																	{isUserAnswer && !isCorrectAnswer && (
																		<span className="text-red-400 font-bold">
																			✗
																		</span>
																	)}
																	<span className="text-sm text-white/90">
																		{option}
																	</span>
																</div>
															</div>
														);
													})}
												</div>

												{/* Explanation */}
												{q.explanation && (
													<div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
														<p className="text-sm text-cyan-200">
															<strong>Explanation:</strong> {q.explanation}
														</p>
													</div>
												)}
												{!q.explanation && (
													<div className="mt-4">
														{!aiExplanations[i] ? (
															<button
																onClick={() => explainWithAI(i)}
																disabled={loadingExplanation === i}
																className="text-sm flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
															>
																{loadingExplanation === i ? (
																	<>
																		<div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
																		Asking AI...
																	</>
																) : (
																	<>Why is this correct? (Ask AI)</>
																)}
															</button>
														) : (
															<div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl animate-in fade-in slide-in-from-top-2">
																<p className="text-sm text-purple-200">
																	<span className="font-bold">
																		🤖 AI Tutor:
																	</span>{" "}
																	{aiExplanations[i]}
																</p>
															</div>
														)}
													</div>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>

						{/* Actions */}
						<div className="flex gap-4 mt-8">
							<button
								onClick={handleRestart}
								className="flex-1 bg-[#FF446D] text-white py-3 rounded-lg font-medium hover:brightness-110 transition"
							>
								Try Again
							</button>
							<Link
								href="/"
								className="flex-1 bg-white/10 text-white/90 py-3 rounded-lg font-medium hover:bg-white/20 transition text-center"
							>
								Back to Home
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Quiz taking view
	const question = quiz.questions[currentQuestion];
	const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

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

			<div className="max-w-3xl mx-auto relative z-10">
				{/* Quiz Header */}
				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 mb-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
							<p className="text-white/70 mt-1">{quiz.description}</p>
						</div>
						<Link
							href="/"
							className="text-white/50 hover:text-white/70 transition"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</Link>
					</div>

					{/* Progress Bar */}
					<div className="mb-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-medium text-white/70">
								Question {currentQuestion + 1} of {quiz.questions.length}
							</span>
							<span className="text-sm font-medium text-[#FF446D]">
								{Math.round(progress)}%
							</span>
						</div>
						<div className="w-full bg-white/10 rounded-full h-2">
							<div
								className="bg-[#FF446D] h-2 rounded-full transition-all duration-300"
								style={{ width: `${progress}%` }}
							></div>
						</div>
					</div>

					{/* Question */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-white mb-6">
							{question.text}
						</h2>

						{/* Options */}
						<div className="space-y-3">
							{question.options.map((option, index) => (
								<button
									key={index}
									onClick={() => handleSelectAnswer(index)}
									className={`w-full text-left p-4 rounded-lg border-2 transition ${
										selectedAnswer === index
											? "border-[#FF446D] bg-[#FF446D]/10"
											: "border-white/20 hover:border-[#FF446D]/50 bg-white/5"
									}`}
								>
									<div className="flex items-center gap-3">
										<div
											className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
												selectedAnswer === index
													? "border-[#FF446D] bg-[#FF446D]"
													: "border-white/30"
											}`}
										>
											{selectedAnswer === index && (
												<svg
													className="w-4 h-4 text-white"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											)}
										</div>
										<span className="text-white">{option}</span>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Next Button */}
					<button
						onClick={handleNext}
						disabled={selectedAnswer === null}
						className="w-full bg-[#FF446D] text-white py-4 rounded-lg font-semibold text-lg hover:brightness-110 disabled:bg-white/10 disabled:cursor-not-allowed transition"
					>
						{currentQuestion + 1 >= quiz.questions.length
							? "Finish Quiz"
							: "Next Question"}
					</button>
				</div>
			</div>
		</div>
	);
}
