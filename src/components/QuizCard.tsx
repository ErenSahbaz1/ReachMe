/**
 * 🎴 QUIZ CARD COMPONENT
 *
 * Displays a quiz summary with:
 * - Title and description
 * - Tags
 * - Question count
 * - Play button
 */

import Link from "next/link";

interface QuizCardProps {
	quiz: {
		_id: string;
		title: string;
		description: string;
		tags?: string[];
		questions?: any[];
		questionCount?: number;
	};
}

export default function QuizCard({ quiz }: QuizCardProps) {
	// Handle both cases: full quiz object or summary
	const questionCount = quiz.questionCount || quiz.questions?.length || 0;
	const tags = quiz.tags || [];

	return (
		<article className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition hover:border-white/20 hover:bg-white/[0.07]">
			<h3 className="text-lg font-semibold">{quiz.title}</h3>
			<p className="mt-2 line-clamp-3 text-sm text-white/70">
				{quiz.description}
			</p>
			{tags.length > 0 && (
				<div className="mt-4 flex flex-wrap gap-2">
					{tags.slice(0, 3).map((tag, index) => (
						<span
							key={`${tag}-${index}`}
							className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
						>
							{tag}
						</span>
					))}
				</div>
			)}
			<div className="mt-6 flex items-center justify-between">
				<span className="text-xs text-white/50">
					{questionCount} question{questionCount !== 1 ? "s" : ""}
				</span>
				<Link
					href={`/quizzes/${quiz._id}`}
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
				</Link>
			</div>
		</article>
	);
}
