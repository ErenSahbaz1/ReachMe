"use client";

/**
 * 🧭 NAVIGATION COMPONENT
 *
 * Shows different links based on auth state:
 * - Logged out: Sign In / Register
 * - Logged in: Create Quiz / Sign Out
 */

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export const Navigation = () => {
	const { data: session, status } = useSession();

	return (
		<header className="sticky top-5 z-20 mx-auto w-full max-w-6xl px-4">
			<nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
				<Link href="/" className="font-semibold tracking-tight">
					MctQ
				</Link>
				<ul className="hidden gap-8 text-sm md:flex items-center">
					<li>
						<Link className="text-white/70 hover:text-white" href="/">
							Home
						</Link>
					</li>
					<li>
						<Link className="text-white/70 hover:text-white" href="#popular">
							Explore
						</Link>
					</li>
					{status === "loading" ? (
						<li className="text-white/50">Loading...</li>
					) : session ? (
						<>
							<li>
								<Link
									className="text-white/70 hover:text-white"
									href="/quizzes/create"
								>
									Create Quiz
								</Link>
							</li>
							<li>
								<Link
									className="text-white/70 hover:text-white"
									href="/quizzes/generate"
								>
									AI Generate
								</Link>
							</li>
							<li>
								<Link
									className="text-white/70 hover:text-white"
									href="/profile"
								>
									Profile
								</Link>
							</li>
							<li>
								<button
									onClick={() => signOut({ callbackUrl: "/" })}
									className="text-white/70 hover:text-white"
								>
									Sign Out
								</button>
							</li>
						</>
					) : (
						<>
							<li>
								<Link className="text-white/70 hover:text-white" href="/signin">
									Sign In
								</Link>
							</li>
							<li>
								<Link
									href="/register"
									className="rounded-full bg-[#FF446D] px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition"
								>
									Register
								</Link>
							</li>
						</>
					)}
				</ul>
				{/* Mobile button */}
				{session ? (
					<Link
						href="/quizzes/create"
						className="md:hidden rounded-full bg-[#FF446D] px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
					>
						Create
					</Link>
				) : (
					<Link
						href="/register"
						className="md:hidden rounded-full bg-[#FF446D] px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
					>
						Start
					</Link>
				)}
			</nav>
		</header>
	);
};
