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
		<div className="relative min-h-screen bg-[#111111] text-white">
			{/* Nav */}
			<Navigation />

			{/* Hero */}
			<section className="mx-auto max-w-6xl px-4 py-30 ">
				<div className="flex flex-col items-center pb-13">
					<p className="text-[#FF446D] font-bold text-xl">Learn</p>
					<h1 className="text-8xl font-black pb-6">Better with MctQ</h1>
					<p className="mt-4 max-w-xl text-base text-white/70">
						Learn together by making quizzes for each other.
					</p>
					<div className="mt-8 flex items-center gap-4">
						<a
							href="#start"
							className="rounded-full bg-[#FF446D] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF446D]/60"
						>
							Start now
						</a>
						<a
							href="#explore"
							className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
						>
							Explore
						</a>
					</div>
					{/* small socials row (optional) */}
					<div className="mt-8 flex items-center gap-4 text-white/30">
						<span className="text-xs">Follow us</span>
						<div className="h-1 w-1 rounded-full bg-white/30" />
						<span className="text-xs">@mctq</span>
					</div>
				</div>
			</section>

			{/* Popular */}
			<section id="popular" className="mx-auto max-w-6xl px-4 pb-24">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-2xl font-bold">Popular quizzes</h2>
					<Link
						href="/quizzes/create"
						className="rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
					>
						Create Quiz
					</Link>
				</div>

				{/* Quiz Grid */}
				{loading ? (
					<div className="text-center py-16">
						<p className="text-white/60 text-lg">Loading quizzes...</p>
					</div>
				) : quizzes.length > 0 ? (
					<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{quizzes.map((quiz: any) => (
							<QuizCard key={quiz._id} quiz={quiz} />
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<p className="text-white/60 text-lg mb-4">No quizzes yet</p>
						<Link
							href="/quizzes/create"
							className="inline-block rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition"
						>
							Create the first quiz!
						</Link>
					</div>
				)}
			</section>

			{/* Footer */}
			<footer className="mx-auto max-w-6xl px-4 pb-12 text-xs text-white/40">
				© {new Date().getFullYear()} MctQ
			</footer>
		</div>
	);
}
