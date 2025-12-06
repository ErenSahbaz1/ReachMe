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
import { useState } from "react";

export const Navigation = () => {
	const { data: session, status } = useSession();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="absolute top-0 left-0 right-0 z-50 px-4 pt-4">
			<nav className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-lg shadow-black/5">
				<div className="flex items-center justify-between px-6 py-4">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 group">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF446D] to-purple-600 flex items-center justify-center font-bold text-white text-sm group-hover:scale-110 transition-transform">
							M
						</div>
						<span className="font-bold text-lg bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
							MctQ
						</span>
					</Link>

					{/* Desktop Navigation */}
					<ul className="hidden lg:flex items-center gap-1">
						<li>
							<Link
								className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
								href="/"
							>
								Home
							</Link>
						</li>
						<li>
							<Link
								className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
								href="#quizzes"
							>
								Explore
							</Link>
						</li>
						{status === "loading" ? (
							<li className="px-4 py-2 text-sm text-white/50">Loading...</li>
						) : session ? (
							<>
								<li>
									<Link
										className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2"
										href="/quizzes/generate"
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
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
										AI Generate
									</Link>
								</li>
								<li>
									<Link
										className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
										href="/profile"
									>
										Profile
									</Link>
								</li>
								{session.user?.role === "admin" && (
									<li>
										<Link
											className="px-4 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all flex items-center gap-1"
											href="/admin"
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
													d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
												/>
											</svg>
											Admin
										</Link>
									</li>
								)}
							</>
						) : null}
					</ul>

					{/* Desktop Actions */}
					<div className="hidden lg:flex items-center gap-3">
						{status === "loading" ? null : session ? (
							<>
								<Link
									href="/quizzes/create"
									className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF446D] to-purple-600 text-sm font-semibold text-white hover:scale-105 transition-transform shadow-lg shadow-[#FF446D]/25"
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
									Create Quiz
								</Link>
								<button
									onClick={() => signOut({ callbackUrl: "/" })}
									className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
								>
									Sign Out
								</button>
							</>
						) : (
							<>
								<Link
									className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
									href="/signin"
								>
									Sign In
								</Link>
								<Link
									href="/register"
									className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF446D] to-purple-600 text-sm font-semibold text-white hover:scale-105 transition-transform shadow-lg shadow-[#FF446D]/25"
								>
									Get Started
								</Link>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<svg
								className="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						) : (
							<svg
								className="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="lg:hidden border-t border-white/10 p-4">
						<ul className="space-y-2">
							<li>
								<Link
									className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
									href="/"
									onClick={() => setMobileMenuOpen(false)}
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
									href="#quizzes"
									onClick={() => setMobileMenuOpen(false)}
								>
									Explore
								</Link>
							</li>
							{status === "loading" ? (
								<li className="px-4 py-2.5 text-sm text-white/50">
									Loading...
								</li>
							) : session ? (
								<>
									<li>
										<Link
											className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
											href="/quizzes/create"
											onClick={() => setMobileMenuOpen(false)}
										>
											Create Quiz
										</Link>
									</li>
									<li>
										<Link
											className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
											href="/quizzes/generate"
											onClick={() => setMobileMenuOpen(false)}
										>
											AI Generate
										</Link>
									</li>
									<li>
										<Link
											className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
											href="/profile"
											onClick={() => setMobileMenuOpen(false)}
										>
											Profile
										</Link>
									</li>
									{session.user?.role === "admin" && (
										<li>
											<Link
												className="block px-4 py-2.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all"
												href="/admin"
												onClick={() => setMobileMenuOpen(false)}
											>
												Admin
											</Link>
										</li>
									)}
									<li className="pt-2 border-t border-white/10">
										<button
											onClick={() => {
												setMobileMenuOpen(false);
												signOut({ callbackUrl: "/" });
											}}
											className="block w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
										>
											Sign Out
										</button>
									</li>
								</>
							) : (
								<>
									<li>
										<Link
											className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
											href="/signin"
											onClick={() => setMobileMenuOpen(false)}
										>
											Sign In
										</Link>
									</li>
									<li>
										<Link
											href="/register"
											className="block px-4 py-2.5 text-center rounded-lg bg-gradient-to-r from-[#FF446D] to-purple-600 text-sm font-semibold text-white"
											onClick={() => setMobileMenuOpen(false)}
										>
											Get Started
										</Link>
									</li>
								</>
							)}
						</ul>
					</div>
				)}
			</nav>
		</header>
	);
};
