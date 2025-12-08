"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Quiz {
	_id: string;
	title: string;
	description?: string;
	visibility: string;
	tags: string[];
	questionCount: number;
	createdAt: string;
}

export default function ProfilePage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

	// Redirect if not logged in
	useEffect(() => {
		if (status === "loading") return;
		if (!session) {
			router.push("/signin");
		}
	}, [session, status, router]);

	// Fetch user's quizzes
	useEffect(() => {
		if (!session) return;

		async function fetchUserQuizzes() {
			try {
				const res = await fetch("/api/quizzes?mine=true");
				const data = await res.json();

				if (!res.ok) {
					setError(data.error || "Failed to load quizzes");
					setLoading(false);
					return;
				}

				setQuizzes(data.quizzes);
				setLoading(false);
			} catch (err) {
				setError("Failed to load your quizzes");
				setLoading(false);
			}
		}

		fetchUserQuizzes();
	}, [session]);

	async function handleDelete(quizId: string) {
		if (!confirm("Are you sure you want to delete this quiz?")) return;

		setDeleteLoading(quizId);
		setError("");

		try {
			const res = await fetch(`/api/quizzes/${quizId}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.error || "Failed to delete quiz");
				setDeleteLoading(null);
				return;
			}

			// Remove from local state
			setQuizzes(quizzes.filter((q) => q._id !== quizId));
			setDeleteLoading(null);
		} catch (err) {
			setError("Failed to delete quiz");
			setDeleteLoading(null);
		}
	}

	if (status === "loading" || !session) {
		return (
			<div className="min-h-screen bg-[#111111] flex items-center justify-center">
				<div className="text-white/70">Loading...</div>
			</div>
		);
	}

	return (
		<>
			{/* Background gradient effects - fixed to viewport */}
			<div className="fixed top-0 -left-20 w-[500px] h-[500px] bg-[#FF446D]/20 rounded-full blur-[120px] animate-pulse -z-10" />
			<div
				className="fixed top-[25vh] right-0 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse -z-10"
				style={{ animationDelay: "1s" }}
			/>
			<div
				className="fixed bottom-[25vh] left-[33vw] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse -z-10"
				style={{ animationDelay: "2s" }}
			/>
			<div
				className="fixed bottom-0 right-[25vw] w-[450px] h-[450px] bg-[#FF446D]/15 rounded-full blur-[120px] animate-pulse -z-10"
				style={{ animationDelay: "1.5s" }}
			/>

			<div className="relative min-h-screen bg-[#111111] py-12 px-4 sm:px-6 lg:px-8 text-white">
				<div className="max-w-6xl mx-auto relative z-10">
					{/* Header */}
					<div className="mb-10">
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-[#FF446D] hover:text-[#FF446D]/80 text-sm font-medium transition mb-4"
						>
							<svg
								className="w-4 h-4"
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
							Back to Home
						</Link>
						<h1 className="text-5xl font-bold text-white mb-3">My Profile</h1>
						<p className="text-white/60 text-lg">
							Manage your quizzes and account information
						</p>
					</div>

					<div className="grid lg:grid-cols-3 gap-8">
						{/* User Info Card */}
						<div className="lg:col-span-1">
							<div className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 sticky top-24 hover:border-[#FF446D]/50 transition-all">
								<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF446D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
								<div className="relative z-10">
									<div className="text-center mb-8">
										<div className="w-20 h-20 bg-gradient-to-br from-[#FF446D]/30 to-purple-600/20 rounded-xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-[#FF446D]/20">
											{session.user?.name?.[0]?.toUpperCase() || "U"}
										</div>
										<h2 className="text-2xl font-bold text-white mb-2">
											{session.user?.name || "User"}
										</h2>
										<p className="text-white/60 text-sm break-all">
											{session.user?.email}
										</p>
									</div>

									<div className="space-y-4 pt-8 border-t border-white/10">
										<div className="bg-gradient-to-br from-[#FF446D]/10 to-transparent rounded-lg p-4 border border-[#FF446D]/20">
											<p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">
												Total Quizzes
											</p>
											<p className="text-white font-bold text-2xl">
												{quizzes.length}
											</p>
										</div>
										<div className="grid grid-cols-2 gap-3">
											<div className="bg-gradient-to-br from-purple-600/10 to-transparent rounded-lg p-4 border border-purple-600/20">
												<p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">
													Public
												</p>
												<p className="text-purple-300 font-bold text-xl">
													{
														quizzes.filter((q) => q.visibility === "public")
															.length
													}
												</p>
											</div>
											<div className="bg-gradient-to-br from-blue-600/10 to-transparent rounded-lg p-4 border border-blue-600/20">
												<p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">
													Private
												</p>
												<p className="text-blue-300 font-bold text-xl">
													{
														quizzes.filter((q) => q.visibility === "private")
															.length
													}
												</p>
											</div>
										</div>
									</div>

									<div className="mt-8 pt-8 border-t border-white/10 space-y-3">
										<Link
											href="/quizzes/create"
											className="block w-full bg-[#FF446D] text-white py-3 rounded-lg font-semibold text-center hover:brightness-110 hover:scale-105 transition transform shadow-lg shadow-[#FF446D]/25"
										>
											✏️ Create Quiz
										</Link>
										<Link
											href="/quizzes/generate"
											className="block w-full bg-gradient-to-r from-purple-600 to-[#FF446D] text-white py-3 rounded-lg font-semibold text-center hover:scale-105 transition transform shadow-lg"
										>
											🤖 AI Generate
										</Link>
									</div>
								</div>
							</div>
						</div>

						{/* Quizzes List */}
						<div className="lg:col-span-2">
							<div className="mb-8">
								<h2 className="text-3xl font-bold text-white mb-2">
									My Quizzes
								</h2>
								<p className="text-white/60">
									You have {quizzes.length}{" "}
									{quizzes.length === 1 ? "quiz" : "quizzes"}
								</p>
							</div>

							{/* Error Message */}
							{error && (
								<div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-300">
									{error}
								</div>
							)}

							{/* Loading State */}
							{loading ? (
								<div className="text-center py-12">
									<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF446D]"></div>
									<p className="text-white/70 mt-4">Loading your quizzes...</p>
								</div>
							) : quizzes.length === 0 ? (
								// Empty State
								<div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-16 text-center">
									<div className="text-6xl mb-4">📝</div>
									<h3 className="text-2xl font-bold text-white mb-2">
										No Quizzes Yet
									</h3>
									<p className="text-white/60 mb-8">
										Create your first quiz to get started!
									</p>
									<Link
										href="/quizzes/create"
										className="inline-block bg-[#FF446D] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#FF446D]/90 transition"
									>
										Create Your First Quiz
									</Link>
								</div>
							) : (
								// Quizzes Grid
								<div className="space-y-4">
									{quizzes.map((quiz) => (
										<div
											key={quiz._id}
											className="group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-[#FF446D]/50 hover:bg-white/[0.07] transition-all"
										>
											<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF446D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
											<div className="relative">
												<div className="flex items-start justify-between gap-6">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-3 mb-3">
															<h3 className="text-lg font-bold text-white truncate">
																{quiz.title}
															</h3>
															<span
																className={`px-2.5 py-1 text-xs font-medium rounded ${
																	quiz.visibility === "public"
																		? "bg-purple-600/20 text-purple-300"
																		: "bg-blue-600/20 text-blue-300"
																}`}
															>
																{quiz.visibility === "public"
																	? "🌐 Public"
																	: "🔒 Private"}
															</span>
														</div>

														{quiz.description && (
															<p className="text-white/60 text-sm mb-4 line-clamp-2">
																{quiz.description}
															</p>
														)}

														<div className="flex items-center gap-4 text-sm text-white/50 mb-3">
															<span>
																📊 {quiz.questionCount}{" "}
																{quiz.questionCount === 1
																	? "question"
																	: "questions"}
															</span>
															<span>•</span>
															<span>
																{new Date(quiz.createdAt).toLocaleDateString(
																	"en-US",
																	{
																		month: "short",
																		day: "numeric",
																		year: "numeric",
																	}
																)}
															</span>
														</div>

														{quiz.tags.length > 0 && (
															<div className="flex flex-wrap gap-1.5">
																{quiz.tags.slice(0, 3).map((tag, idx) => (
																	<span
																		key={idx}
																		className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded"
																	>
																		{tag}
																	</span>
																))}
																{quiz.tags.length > 3 && (
																	<span className="text-white/50 text-xs">
																		+{quiz.tags.length - 3}
																	</span>
																)}
															</div>
														)}
													</div>

													{/* Actions */}
													<div className="flex flex-col gap-2">
														<Link
															href={`/quizzes/${quiz._id}`}
															className="px-4 py-2 bg-[#FF446D] text-white text-sm font-semibold rounded hover:brightness-110 transition whitespace-nowrap text-center shadow-lg shadow-[#FF446D]/25"
														>
															View
														</Link>
														<Link
															href={`/quizzes/create?edit=${quiz._id}`}
															className="px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded hover:bg-white/20 transition whitespace-nowrap text-center"
														>
															Edit
														</Link>
														<button
															onClick={() => handleDelete(quiz._id)}
															disabled={deleteLoading === quiz._id}
															className="px-4 py-2 bg-red-500/20 text-red-300 text-sm font-semibold rounded hover:bg-red-500/30 transition disabled:opacity-50 whitespace-nowrap"
														>
															{deleteLoading === quiz._id ? "..." : "Delete"}
														</button>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
