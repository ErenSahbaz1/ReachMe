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

			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/"
						className="text-[#FF446D] hover:brightness-110 text-sm font-medium"
					>
						← Back to Home
					</Link>
					<h1 className="text-4xl font-bold text-white mt-4">
						Admin Dashboard
					</h1>
					<p className="text-white/70 mt-2">
						Manage users and monitor platform activity
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
						<h3 className="text-white/70 text-sm font-medium">Total Users</h3>
						<p className="text-3xl font-bold text-white mt-2">{users.length}</p>
					</div>

					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
						<h3 className="text-white/70 text-sm font-medium">Total Quizzes</h3>
						<p className="text-3xl font-bold text-white mt-2">
							{quizzes.length}
						</p>
					</div>

					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
						<h3 className="text-white/70 text-sm font-medium">
							Avg Quizzes/User
						</h3>
						<p className="text-3xl font-bold text-white mt-2">
							{users.length > 0
								? (quizzes.length / users.length).toFixed(1)
								: 0}
						</p>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-2 mb-6 bg-white/5 p-2 rounded-xl border border-white/10">
					<button
						onClick={() => setActiveTab("users")}
						className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
							activeTab === "users"
								? "bg-[#FF446D] text-white"
								: "text-white/70 hover:text-white hover:bg-white/5"
						}`}
					>
						👥 Users ({users.length})
					</button>
					<button
						onClick={() => setActiveTab("quizzes")}
						className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
							activeTab === "quizzes"
								? "bg-[#FF446D] text-white"
								: "text-white/70 hover:text-white hover:bg-white/5"
						}`}
					>
						📝 Quizzes ({quizzes.length})
					</button>
				</div>

				{/* Search */}
				<div className="mb-6">
					<input
						type="text"
						placeholder="Search users by name or email..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#FF446D] outline-none placeholder:text-white/40"
					/>
				</div>

				{/* Content based on active tab */}
				{activeTab === "users" ? (
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-white/5">
									<tr>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											User
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Email
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Role
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Quizzes
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Joined
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/10">
									{filteredUsers.map((user) => (
										<tr key={user._id} className="hover:bg-white/5 transition">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF446D] to-[#7C3AED] flex items-center justify-center text-white font-bold">
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
															? "bg-purple-500/20 text-purple-300"
															: "bg-blue-500/20 text-blue-300"
													}`}
												>
													{user.role}
												</span>
											</td>
											<td className="px-6 py-4">
												<span className="px-3 py-1 bg-[#FF446D]/20 text-[#FF446D] rounded-full text-sm font-medium">
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
							<div className="text-center py-12">
								<p className="text-white/50">
									{searchQuery ? "No users found" : "No users yet"}
								</p>
							</div>
						)}
					</div>
				) : (
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-white/5">
									<tr>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Quiz
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Owner
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Questions
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Visibility
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Created
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/10">
									{filteredQuizzes.map((quiz) => (
										<tr key={quiz._id} className="hover:bg-white/5 transition">
											<td className="px-6 py-4">
												<div className="max-w-xs">
													<div className="text-white font-medium truncate">
														{quiz.title}
													</div>
													{quiz.description && (
														<div className="text-white/50 text-sm truncate mt-1">
															{quiz.description}
														</div>
													)}
													{quiz.tags.length > 0 && (
														<div className="flex flex-wrap gap-1 mt-2">
															{quiz.tags.slice(0, 3).map((tag, idx) => (
																<span
																	key={idx}
																	className="px-2 py-0.5 bg-white/10 text-white/60 text-xs rounded-full"
																>
																	{tag}
																</span>
															))}
														</div>
													)}
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="text-white/90">{quiz.ownerName}</div>
												<div className="text-white/50 text-sm">
													{quiz.ownerEmail}
												</div>
											</td>
											<td className="px-6 py-4">
												<span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium">
													{quiz.questionCount}
												</span>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														quiz.visibility === "public"
															? "bg-green-500/20 text-green-300"
															: "bg-orange-500/20 text-orange-300"
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
														className="px-3 py-1.5 bg-[#FF446D] text-white text-xs font-medium rounded-lg hover:brightness-110 transition"
													>
														View
													</Link>
													<Link
														href={`/quizzes/create?edit=${quiz._id}`}
														className="px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition"
													>
														Edit
													</Link>
													<button
														onClick={() => handleDeleteQuiz(quiz._id)}
														disabled={deleteLoading === quiz._id}
														className="px-3 py-1.5 bg-red-500/20 text-red-300 text-xs font-medium rounded-lg hover:bg-red-500/30 transition disabled:opacity-50"
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
							<div className="text-center py-12">
								<p className="text-white/50">
									{searchQuery ? "No quizzes found" : "No quizzes yet"}
								</p>
							</div>
						)}
					</div>
				)}

				{/* Results Info */}
				{searchQuery && (
					<div className="mt-4 text-center text-white/60 text-sm">
						{activeTab === "users" ? (
							<>
								Showing {filteredUsers.length} of {users.length} users
							</>
						) : (
							<>
								Showing {filteredQuizzes.length} of {quizzes.length} quizzes
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
