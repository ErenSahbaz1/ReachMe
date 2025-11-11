"use client";

import { Navigation } from "@/components/Navigation";

export default function Home() {
	return (
		<div className="min-h-screen bg-[#111111] text-white">
			{/* Nav */}
			<Navigation />

			{/* Hero */}
			<section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-10 pt-16 md:grid-cols-2 md:pb-20 md:pt-24">
				<div>
					<p className="text-[#FF446D] font-semibold">Learn alone</p>
					<h1 className=" text-8xl font-extrabold ">Or together</h1>
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
				<div className="flex items-end justify-end">
					{/* Placeholder visual block */}
					<div className="h-72 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]" />
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
function QuizCard() {
	return (
		<article className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition hover:border-white/20 hover:bg-white/[0.07]">
			<h3 className="text-lg font-semibold">Web1 Theory</h3>
			<p className="mt-2 line-clamp-3 text-sm text-white/70">
				Explore the world of HTML5 and CSS3. Learn the basics of web
				development.
			</p>
			<div className="mt-6 flex items-center justify-between">
				<span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
					Y1
				</span>
				<a
					href="#play"
					className="inline-flex items-center gap-2 rounded-full bg-[#FF446D] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
				>
					Play
					<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
						<path
							d="M5 12h14M13 5l7 7-7 7"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</a>
			</div>
		</article>
	);
}
