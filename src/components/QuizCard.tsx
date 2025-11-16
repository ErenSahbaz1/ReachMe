export default function QuizCard() {
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
