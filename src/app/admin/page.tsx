"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserWithStats {
	_id: string;
	name: string;
	email: string;
	role: string;
	image?: string;
	createdAt: string;
	quizCount: number;
}

interface QuizWithOwner {
	_id: string;
	title: string;
	description?: string;
	visibility: string;
	tags: string[];
	createdAt: string;
	questionCount: number;
	ownerName: string;
	ownerEmail: string;
	ownerId: string;
}

export default function AdminPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [activeTab, setActiveTab] = useState<"users" | "quizzes">("users");
	const [users, setUsers] = useState<UserWithStats[]>([]);
	const [quizzes, setQuizzes] = useState<QuizWithOwner[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/signin");
			return;
		}

		if (status === "authenticated") {
			fetchUsers();
			fetchQuizzes();
		}
	}, [status, router]);

	async function fetchUsers() {
		try {
			const res = await fetch("/api/admin/users");
			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to load users");
				setLoading(false);
				return;
			}

			setUsers(data.users);
			setLoading(false);
		} catch (err) {
			setError("Failed to load users");
			setLoading(false);
		}
	}

	async function fetchQuizzes() {
		try {
			const res = await fetch("/api/admin/quizzes");
			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to load quizzes");
				return;
			}

			setQuizzes(data.quizzes);
		} catch (err) {
			setError("Failed to load quizzes");
		}
	}

	async function handleDeleteQuiz(quizId: string) {
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

			setQuizzes(quizzes.filter((q) => q._id !== quizId));
			setDeleteLoading(null);
		} catch (err) {
			setError("Failed to delete quiz");
			setDeleteLoading(null);
		}
	}

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredQuizzes = quizzes.filter(
		(quiz) =>
			quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			quiz.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			quiz.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (status === "loading" || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#111111]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF446D]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#111111]">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
					<p className="text-white/70 mb-4">{error}</p>
					<Link
						href="/"
						className="text-[#FF446D] hover:brightness-110 inline-block"
					>
						← Back to Home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#0f0f12] py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
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
					<h1 className="text-5xl font-bold text-white">Admin Dashboard</h1>
					<p className="text-white/60 mt-3 text-lg">
						Manage users and monitor platform activity
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-7 hover:bg-white/[0.08] transition">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-white/60 text-sm font-medium uppercase tracking-wide">
									Total Users
								</p>
								<p className="text-4xl font-bold text-white mt-3">
									{users.length}
								</p>
							</div>
							<div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-2xl">
								👥
							</div>
						</div>
					</div>

					<div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-7 hover:bg-white/[0.08] transition">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-white/60 text-sm font-medium uppercase tracking-wide">
									Total Quizzes
								</p>
								<p className="text-4xl font-bold text-white mt-3">
									{quizzes.length}
								</p>
							</div>
							<div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-2xl">
								📝
							</div>
						</div>
					</div>

					<div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-7 hover:bg-white/[0.08] transition">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-white/60 text-sm font-medium uppercase tracking-wide">
									Avg Quizzes/User
								</p>
								<p className="text-4xl font-bold text-white mt-3">
									{users.length > 0
										? (quizzes.length / users.length).toFixed(1)
										: 0}
								</p>
							</div>
							<div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-2xl">
								📊
							</div>
						</div>
					</div>
				</div>

				{/* Tabs and Search */}
				<div className="mb-8 space-y-6">
					<div className="flex gap-3 border-b border-white/10">
						<button
							onClick={() => setActiveTab("users")}
							className={`py-4 px-6 font-semibold transition border-b-2 -mb-px ${
								activeTab === "users"
									? "border-[#FF446D] text-white"
									: "border-transparent text-white/60 hover:text-white"
							}`}
						>
							👥 Users ({users.length})
						</button>
						<button
							onClick={() => setActiveTab("quizzes")}
							className={`py-4 px-6 font-semibold transition border-b-2 -mb-px ${
								activeTab === "quizzes"
									? "border-[#FF446D] text-white"
									: "border-transparent text-white/60 hover:text-white"
							}`}
						>
							📝 Quizzes ({quizzes.length})
						</button>
					</div>

					{/* Search */}
					<div>
						<label className="block text-white/60 text-sm font-medium mb-3">
							Search
						</label>
						<input
							type="text"
							placeholder={
								activeTab === "users"
									? "Search by name or email..."
									: "Search by title or owner..."
							}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF446D] placeholder:text-white/40 transition"
						/>
					</div>
				</div>

				{/* Content based on active tab */}
				{activeTab === "users" ? (
					<div className="bg-white/[0.05] border border-white/[0.08] rounded-xl overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-white/[0.08] border-b border-white/[0.08]">
									<tr>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											User
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Email
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Role
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Quizzes
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Joined
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/[0.08]">
									{filteredUsers.map((user) => (
										<tr
											key={user._id}
											className="hover:bg-white/[0.08] transition"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-lg bg-[#FF446D]/20 flex items-center justify-center text-white font-bold text-sm">
														{user.name.charAt(0).toUpperCase()}
													</div>
													<span className="text-white font-medium">
														{user.name}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 text-white/70">{user.email}</td>
											<td className="px-6 py-4">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														user.role === "admin"
															? "bg-purple-500/15 text-purple-200"
															: "bg-blue-500/15 text-blue-200"
													}`}
												>
													{user.role}
												</span>
											</td>
											<td className="px-6 py-4">
												<span className="px-3 py-1 bg-white/10 text-white rounded text-sm font-medium">
													{user.quizCount}
												</span>
											</td>
											<td className="px-6 py-4 text-white/70 text-sm">
												{new Date(user.createdAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{filteredUsers.length === 0 && (
							<div className="text-center py-16">
								<p className="text-white/50 text-lg">
									{searchQuery ? "No users found" : "No users yet"}
								</p>
							</div>
						)}
					</div>
				) : (
					<div className="bg-white/[0.05] border border-white/[0.08] rounded-xl overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-white/[0.08] border-b border-white/[0.08]">
									<tr>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Quiz
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Owner
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Questions
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Visibility
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Created
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/[0.08]">
									{filteredQuizzes.map((quiz) => (
										<tr
											key={quiz._id}
											className="hover:bg-white/[0.08] transition"
										>
											<td className="px-6 py-4">
												<div className="max-w-sm">
													<div className="text-white font-medium truncate">
														{quiz.title}
													</div>
													{quiz.description && (
														<div className="text-white/50 text-sm truncate mt-1">
															{quiz.description}
														</div>
													)}
													{quiz.tags.length > 0 && (
														<div className="flex flex-wrap gap-1.5 mt-2">
															{quiz.tags.slice(0, 2).map((tag, idx) => (
																<span
																	key={idx}
																	className="px-2 py-0.5 bg-white/5 text-white/60 text-xs rounded"
																>
																	{tag}
																</span>
															))}
															{quiz.tags.length > 2 && (
																<span className="text-white/50 text-xs">
																	+{quiz.tags.length - 2}
																</span>
															)}
														</div>
													)}
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="text-white/90 font-medium">
													{quiz.ownerName}
												</div>
												<div className="text-white/50 text-sm">
													{quiz.ownerEmail}
												</div>
											</td>
											<td className="px-6 py-4">
												<span className="px-3 py-1 bg-white/10 text-white rounded text-sm font-medium">
													{quiz.questionCount}
												</span>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-3 py-1 rounded text-xs font-medium ${
														quiz.visibility === "public"
															? "bg-green-500/15 text-green-200"
															: "bg-orange-500/15 text-orange-200"
													}`}
												>
													{quiz.visibility === "public"
														? "🌐 Public"
														: "🔒 Private"}
												</span>
											</td>
											<td className="px-6 py-4 text-white/70 text-sm whitespace-nowrap">
												{new Date(quiz.createdAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})}
											</td>
											<td className="px-6 py-4">
												<div className="flex gap-2">
													<Link
														href={`/quizzes/${quiz._id}`}
														className="px-3 py-1.5 bg-[#FF446D] text-white text-xs font-semibold rounded transition hover:bg-[#FF446D]/90"
													>
														View
													</Link>
													<Link
														href={`/quizzes/create?edit=${quiz._id}`}
														className="px-3 py-1.5 bg-white/10 text-white text-xs font-semibold rounded transition hover:bg-white/20"
													>
														Edit
													</Link>
													<button
														onClick={() => handleDeleteQuiz(quiz._id)}
														disabled={deleteLoading === quiz._id}
														className="px-3 py-1.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded transition hover:bg-red-500/25 disabled:opacity-50"
													>
														{deleteLoading === quiz._id ? "..." : "Delete"}
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{filteredQuizzes.length === 0 && (
							<div className="text-center py-16">
								<p className="text-white/50 text-lg">
									{searchQuery ? "No quizzes found" : "No quizzes yet"}
								</p>
							</div>
						)}
					</div>
				)}

				{/* Results Info */}
				{searchQuery && (
					<div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
						<p className="text-white/60 text-sm">
							{activeTab === "users" ? (
								<>
									Showing{" "}
									<span className="text-white font-semibold">
										{filteredUsers.length}
									</span>{" "}
									of{" "}
									<span className="text-white font-semibold">
										{users.length}
									</span>{" "}
									users
								</>
							) : (
								<>
									Showing{" "}
									<span className="text-white font-semibold">
										{filteredQuizzes.length}
									</span>{" "}
									of{" "}
									<span className="text-white font-semibold">
										{quizzes.length}
									</span>{" "}
									quizzes
								</>
							)}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
