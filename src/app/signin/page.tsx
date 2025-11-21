"use client";

/**
 * 🔐 SIGN IN PAGE
 *
 * This page:
 * 1. Shows email/password form
 * 2. Calls NextAuth signIn() on submit
 * 3. Redirects to home on success
 *
 * KEY CONCEPT: "use client" directive
 * - Needed for interactive components (forms, state, events)
 * - Server Components can't use useState, onClick, etc.
 */

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	/**
	 * Handle form submission
	 *
	 * FLOW:
	 * 1. Prevent page reload
	 * 2. Call NextAuth signIn()
	 * 3. Check if successful
	 * 4. Redirect or show error
	 */
	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			// signIn returns { error, status, ok, url }
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false, // Don't auto-redirect (we handle it)
			});

			if (result?.error) {
				setError("Invalid email or password");
			} else {
				// Success! Redirect to home
				router.push("/");
				router.refresh(); // Refresh server components
			}
		} catch (err) {
			setError("Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center bg-[#111111] px-4">
			{/* Background Glows - Same as home page */}
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
			<div
				className="absolute -z-30 left-[-80px] bottom-20 w-[520px] h-[520px] rounded-full opacity-50 blur-3xl pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, #06B6D4 0%, rgba(6,182,212,0.12) 40%, transparent 70%)",
				}}
			/>

			<div className="max-w-md w-full relative z-10">
				{/* Card */}
				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-white">Welcome Back</h1>
						<p className="text-white/70 mt-2">Sign in to continue to ReachMe</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg">
							{error}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-white/90 mb-2"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#FF446D] focus:border-transparent outline-none transition placeholder:text-white/40"
								placeholder="you@example.com"
							/>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-white/90 mb-2"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={8}
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#FF446D] focus:border-transparent outline-none transition placeholder:text-white/40"
								placeholder="••••••••"
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-[#FF446D] text-white py-3 rounded-lg font-medium hover:brightness-110 disabled:bg-white/20 disabled:cursor-not-allowed transition"
						>
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</form>

					{/* Register Link */}
					<p className="text-center mt-6 text-white/60">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="text-[#FF446D] font-medium hover:brightness-110 transition"
						>
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
