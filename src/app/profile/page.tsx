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
		<div className="min-h-screen bg-[#111111] py-12 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/"
						className="text-[#FF446D] hover:text-[#FF446D]/80 mb-4 inline-flex items-center gap-2"
					>
						← Back to Home
					</Link>
					<h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
					<p className="text-white/70">
						Manage your quizzes and account information
					</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* User Info Card */}
					<div className="lg:col-span-1">
						<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-24">
							<div className="text-center mb-6">
								<div className="w-24 h-24 bg-gradient-to-br from-[#FF446D] to-[#FF8E53] rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
									{session.user?.name?.[0]?.toUpperCase() || "U"}
								</div>
								<h2 className="text-2xl font-bold text-white mb-1">
									{session.user?.name || "User"}
								</h2>
								<p className="text-white/60 text-sm">{session.user?.email}</p>
							</div>

							<div className="space-y-4 pt-6 border-t border-white/10">
								<div className="flex justify-between items-center">
									<span className="text-white/70">Total Quizzes</span>
									<span className="text-white font-semibold text-lg">
										{quizzes.length}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-white/70">Public Quizzes</span>
									<span className="text-white font-semibold text-lg">
										{quizzes.filter((q) => q.visibility === "public").length}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-white/70">Private Quizzes</span>
									<span className="text-white font-semibold text-lg">
										{quizzes.filter((q) => q.visibility === "private").length}
									</span>
								</div>
							</div>

							<div className="mt-6 pt-6 border-t border-white/10 space-y-3">
								<Link
									href="/quizzes/create"
									className="block w-full bg-[#FF446D] text-white py-3 rounded-lg font-semibold text-center hover:brightness-110 transition"
								>
									Create New Quiz
								</Link>
								<Link
									href="/quizzes/generate"
									className="block w-full bg-white/10 text-white py-3 rounded-lg font-semibold text-center hover:bg-white/20 transition"
								>
									AI Generate Quiz
								</Link>
							</div>
						</div>
					</div>

					{/* Quizzes List */}
					<div className="lg:col-span-2">
						<div className="mb-6">
							<h2 className="text-2xl font-bold text-white mb-2">
								My Quizzes ({quizzes.length})
							</h2>
							<p className="text-white/60">
								View, edit, or delete your created quizzes
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
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
								<div className="text-6xl mb-4">📝</div>
								<h3 className="text-2xl font-bold text-white mb-2">
									No Quizzes Yet
								</h3>
								<p className="text-white/60 mb-6">
									Create your first quiz to get started!
								</p>
								<Link
									href="/quizzes/create"
									className="inline-block bg-[#FF446D] text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition"
								>
									Create Quiz
								</Link>
							</div>
						) : (
							// Quizzes Grid
							<div className="space-y-4">
								{quizzes.map((quiz) => (
									<div
										key={quiz._id}
										className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition group"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-3 mb-2">
													<h3 className="text-xl font-bold text-white truncate">
														{quiz.title}
													</h3>
													<span
														className={`px-2 py-1 text-xs rounded-full ${
															quiz.visibility === "public"
																? "bg-green-500/20 text-green-300"
																: "bg-orange-500/20 text-orange-300"
														}`}
													>
														{quiz.visibility === "public"
															? "🌐 Public"
															: "🔒 Private"}
													</span>
												</div>

												{quiz.description && (
													<p className="text-white/60 text-sm mb-3 line-clamp-2">
														{quiz.description}
													</p>
												)}

												<div className="flex items-center gap-4 text-sm text-white/50">
													<span>{quiz.questionCount} questions</span>
													<span>•</span>
													<span>
														Created{" "}
														{new Date(quiz.createdAt).toLocaleDateString()}
													</span>
												</div>

												{quiz.tags.length > 0 && (
													<div className="flex flex-wrap gap-2 mt-3">
														{quiz.tags.map((tag, idx) => (
															<span
																key={idx}
																className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
															>
																{tag}
															</span>
														))}
													</div>
												)}
											</div>

											{/* Actions */}
											<div className="flex flex-col gap-2">
												<Link
													href={`/quizzes/${quiz._id}`}
													className="px-4 py-2 bg-[#FF446D] text-white text-sm font-medium rounded-lg hover:brightness-110 transition whitespace-nowrap"
												>
													View
												</Link>
												<Link
													href={`/quizzes/create?edit=${quiz._id}`}
													className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition whitespace-nowrap"
												>
													Edit
												</Link>
												<button
													onClick={() => handleDelete(quiz._id)}
													disabled={deleteLoading === quiz._id}
													className="px-4 py-2 bg-red-500/20 text-red-300 text-sm font-medium rounded-lg hover:bg-red-500/30 transition disabled:opacity-50 whitespace-nowrap"
												>
													{deleteLoading === quiz._id ? "..." : "Delete"}
												</button>
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
	);
}
