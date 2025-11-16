"use client";

import { Navigation } from "@/components/Navigation";
import QuizCard from "@/components/QuizCard";
import TrueFocus from "@/components/TrueFocus";

export default function Home() {
	return (
		<div className="relative min-h-screen bg-[#111111] text-white">
			<div
				className="absolute -z-10 left-1/4 top-12 w-[480px] h-[480px] rounded-full opacity-70 blur-3xl"
				style={{
					background:
						"radial-gradient(circle, #FF446D 0%, rgba(255,68,109,0.25) 40%, transparent 70%)",
				}}
			/>
			<div
				className="absolute -z-20 right-0 top-40 w-[360px] h-[360px] rounded-full opacity-60 blur-2xl"
				style={{
					background:
						"radial-gradient(circle, #7C3AED 0%, rgba(124,58,237,0.2) 40%, transparent 70%)",
				}}
			/>
			<div
				className="absolute -z-30 left-[-80px] bottom-20 w-[520px] h-[520px] rounded-full opacity-50 blur-3xl"
				style={{
					background:
						"radial-gradient(circle, #06B6D4 0%, rgba(6,182,212,0.12) 40%, transparent 70%)",
				}}
			/>
			{/* Nav */}
			<Navigation />

			{/* Hero */}
			<section className="mx-auto max-w-6xl px-4 py-30 ">
				<div>
					<p className="text-[#FF446D] font-bold text-xl">Learn alone</p>
					<TrueFocus
						sentence="Or Together"
						manualMode={false}
						blurAmount={9}
						borderColor="red"
						animationDuration={2}
						pauseBetweenAnimations={1}
					/>
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
				<h2 className="text-2xl font-bold">Popular quizzes</h2>
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<QuizCard key={i} />
					))}
				</div>
			</section>

			{/* Footer */}
			<footer className="mx-auto max-w-6xl px-4 pb-12 text-xs text-white/40">
				© {new Date().getFullYear()} MctQ
			</footer>
		</div>
	);
}
