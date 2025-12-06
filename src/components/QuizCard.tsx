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
		<article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#FF446D]/30 hover:shadow-2xl hover:shadow-[#FF446D]/10 hover:-translate-y-1">
			{/* Gradient overlay on hover */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#FF446D]/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

			{/* Content */}
			<div className="relative z-10">
				{/* Header with icon */}
				<div className="flex items-start justify-between gap-3 mb-3">
					<h3 className="text-xl font-bold leading-tight group-hover:text-[#FF446D] transition-colors line-clamp-2">
						{quiz.title}
					</h3>
					<div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF446D]/20 to-purple-600/20 border border-[#FF446D]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg
							className="w-5 h-5 text-[#FF446D]"
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
				</div>

				{/* Description */}
				<p className="mt-3 line-clamp-2 text-sm text-white/60 leading-relaxed">
					{quiz.description}
				</p>

				{/* Tags */}
				{tags.length > 0 && (
					<div className="mt-4 flex flex-wrap gap-2">
						{tags.slice(0, 3).map((tag, index) => (
							<span
								key={`${tag}-${index}`}
								className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-white/70 backdrop-blur-sm"
							>
								<span className="w-1.5 h-1.5 rounded-full bg-[#FF446D]/60" />
								{tag}
							</span>
						))}
						{tags.length > 3 && (
							<span className="inline-flex items-center rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-white/50">
								+{tags.length - 3}
							</span>
						)}
					</div>
				)}

				{/* Footer */}
				<div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
					<div className="flex items-center gap-2 text-white/50">
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
								d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span className="text-sm font-medium">
							{questionCount} question{questionCount !== 1 ? "s" : ""}
						</span>
					</div>
					<Link
						href={`/quizzes/${quiz._id}`}
						className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF446D] to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#FF446D]/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#FF446D]/30"
					>
						Start Quiz
						<svg
							className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
			</div>
		</article>
	);
}
