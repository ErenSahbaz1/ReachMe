"use client";

/**
 * 🏠 HOME PAGE (Client Component)
 *
 * KEY CONCEPT: Client Components
 * - Use "use client" when you need interactivity
 * - Can use hooks like useState, useEffect
 * - Needed for components like TrueFocus that have animations
 *
 * We use "use client" because:
 * - TrueFocus component needs client-side animations
 * - We'll fetch data with useEffect
 */

import { Navigation } from "@/components/Navigation";
import QuizCard from "@/components/QuizCard";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
	const [quizzes, setQuizzes] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch quizzes on component mount
	useEffect(() => {
		async function fetchQuizzes() {
			try {
				const res = await fetch("/api/quizzes?limit=6");
				if (res.ok) {
					const data = await res.json();
					setQuizzes(data.quizzes || []);
				}
			} catch (error) {
				console.error("Failed to fetch quizzes:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchQuizzes();
	}, []);
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

			<div className="relative min-h-screen text-white overflow-x-hidden bg-[#111111]">
				{/* Nav */}
				<Navigation />

				{/* Hero Section */}
				<section className="mx-auto max-w-7xl px-4 pt-20 pb-32">
					<div className="text-center">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 mb-8 mt-18">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF446D] opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF446D]"></span>
							</span>
							<span className="text-sm text-white/80">
								Learn smarter, together
							</span>
						</div>

						{/* Main Heading */}
						<h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6">
							<span className="block">Better learning</span>
							<span className="block bg-gradient-to-r from-[#FF446D] to-purple-600 bg-clip-text text-transparent">
								with MctQ
							</span>
						</h1>

						{/* Description */}
						<p className="mt-6 max-w-2xl mx-auto text-lg text-white/60 leading-relaxed">
							Create, share, and take interactive quizzes. Learn together with
							AI-powered quiz generation and instant feedback.
						</p>

						{/* CTA Buttons */}
						<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
							<Link
								href="/quizzes/create"
								className="group w-full sm:w-auto rounded-full bg-[#FF446D] px-8 py-4 text-base font-semibold text-white transition hover:brightness-110 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF446D]/60 shadow-lg shadow-[#FF446D]/25"
							>
								<span className="flex items-center justify-center gap-2">
									Create Quiz
									<svg
										className="w-5 h-5 group-hover:translate-x-1 transition-transform"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 7l5 5m0 0l-5 5m5-5H6"
										/>
									</svg>
								</span>
							</Link>
							<Link
								href="#quizzes"
								className="w-full sm:w-auto rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white/90 hover:bg-white/10 hover:border-white/30 transition"
							>
								Browse Quizzes
							</Link>
						</div>

						{/* Stats */}
						<div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/50">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-[#FF446D]" />
								<span>AI-Powered Generation</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-purple-600" />
								<span>Instant Feedback</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-blue-600" />
								<span>PDF Support</span>
							</div>
						</div>
					</div>
				</section>

				{/* Features Grid */}
				<section className="mx-auto max-w-7xl px-4 pb-24">
					<div className="grid md:grid-cols-3 gap-6">
						{/* Feature 1 */}
						<div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:border-[#FF446D]/50 hover:bg-white/[0.07] transition-all">
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF446D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative">
								<div className="w-12 h-12 rounded-xl bg-[#FF446D]/20 flex items-center justify-center mb-4">
									<svg
										className="w-6 h-6 text-[#FF446D]"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold mb-2">AI Generation</h3>
								<p className="text-white/60 text-sm leading-relaxed">
									Generate quizzes instantly from text or PDF using advanced AI
									technology
								</p>
							</div>
						</div>

						{/* Feature 2 */}
						<div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:border-purple-600/50 hover:bg-white/[0.07] transition-all">
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative">
								<div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center mb-4">
									<svg
										className="w-6 h-6 text-purple-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold mb-2">Collaborative</h3>
								<p className="text-white/60 text-sm leading-relaxed">
									Share quizzes with your team, get feedback, and learn together
								</p>
							</div>
						</div>

						{/* Feature 3 */}
						<div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:border-blue-600/50 hover:bg-white/[0.07] transition-all">
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative">
								<div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-4">
									<svg
										className="w-6 h-6 text-blue-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold mb-2">Instant Feedback</h3>
								<p className="text-white/60 text-sm leading-relaxed">
									Get AI-powered explanations for every answer to understand
									concepts better
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Quizzes Section */}
				<section id="quizzes" className="mx-auto max-w-7xl px-4 pb-24">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
						<div>
							<h2 className="text-3xl font-bold mb-2">Recent Quizzes</h2>
							<p className="text-white/60">
								Explore quizzes created by the community
							</p>
						</div>
						<Link
							href="/quizzes/generate"
							className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-[#FF446D] px-6 py-3 text-sm font-semibold text-white hover:scale-105 transition-transform shadow-lg"
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
									d="M12 4v16m8-8H4"
								/>
							</svg>
							Generate with AI
						</Link>
					</div>

					{/* Quiz Grid */}
					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-12 h-12 border-4 border-white/20 border-t-[#FF446D] rounded-full animate-spin" />
							<p className="text-white/60 text-lg mt-4">Loading quizzes...</p>
						</div>
					) : quizzes.length > 0 ? (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{quizzes.map((quiz: any) => (
								<QuizCard key={quiz._id} quiz={quiz} />
							))}
						</div>
					) : (
						<div className="text-center py-20 rounded-2xl border border-dashed border-white/20 bg-white/5">
							<div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-white/40"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<p className="text-white/60 text-lg mb-6">
								No quizzes yet. Be the first!
							</p>
							<Link
								href="/quizzes/create"
								className="inline-flex items-center gap-2 rounded-full bg-[#FF446D] px-6 py-3 text-sm font-semibold text-white hover:brightness-110 transition"
							>
								Create First Quiz
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
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
							</Link>
						</div>
					)}
				</section>

				{/* Footer */}
				<footer className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
					<div className="mx-auto max-w-7xl px-4 py-8">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
							<div className="flex items-center gap-2">
								<span className="text-xl font-bold bg-gradient-to-r from-[#FF446D] to-purple-600 bg-clip-text text-transparent">
									MctQ
								</span>
								<span className="text-xs text-white/40">
									© {new Date().getFullYear()}
								</span>
							</div>
							<div className="flex items-center gap-6 text-sm text-white/50">
								<Link href="/about" className="hover:text-white/80 transition">
									About
								</Link>
								<Link
									href="/contact"
									className="hover:text-white/80 transition"
								>
									Contact
								</Link>
								<Link
									href="/privacy"
									className="hover:text-white/80 transition"
								>
									Privacy
								</Link>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}
