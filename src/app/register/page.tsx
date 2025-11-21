"use client";

/**
 * 📝 REGISTER PAGE
 *
 * This page:
 * 1. Collects name, email, password
 * 2. POSTs to /api/auth/register
 * 3. Auto-signs in on success
 * 4. Redirects to home
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			// 1. Register the user
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Registration failed");
				setLoading(false);
				return;
			}

			// 2. Auto sign in after registration
			const signInResult = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (signInResult?.error) {
				// Registration worked but sign in failed
				// Redirect to sign in page
				router.push("/signin");
			} else {
				// Success! Go to home
				router.push("/");
				router.refresh();
			}
		} catch (err) {
			setError("Something went wrong");
			setLoading(false);
		}
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center bg-[#111111] px-4">
			{/* Background Glows */}
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
						<h1 className="text-3xl font-bold text-white">Create Account</h1>
						<p className="text-white/70 mt-2">Join ReachMe today</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg">
							{error}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-white/90 mb-2"
							>
								Name
							</label>
							<input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition placeholder:text-white/40"
								placeholder="John Doe"
							/>
						</div>

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
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition placeholder:text-white/40"
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
								className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition placeholder:text-white/40"
								placeholder="••••••••"
							/>
							<p className="text-sm text-white/50 mt-1">
								Must be at least 8 characters
							</p>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-[#7C3AED] text-white py-3 rounded-lg font-medium hover:brightness-110 disabled:bg-white/20 disabled:cursor-not-allowed transition"
						>
							{loading ? "Creating account..." : "Register"}
						</button>
					</form>

					{/* Sign In Link */}
					<p className="text-center mt-6 text-white/60">
						Already have an account?{" "}
						<Link
							href="/signin"
							className="text-[#7C3AED] font-medium hover:brightness-110 transition"
						>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
