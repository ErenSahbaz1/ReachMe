import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

/**
 * 🔒 AUTHENTICATION HELPER
 *
 * This function:
 * 1. Gets the session from the request
 * 2. Checks if user is logged in
 * 3. Returns user data OR unauthorized response
 *
 * USAGE in API routes:
 * ```ts
 * const auth = await requireAuth();
 * if (auth instanceof NextResponse) return auth; // Not logged in
 * const userId = auth.user.id; // Logged in! Use the data
 * ```
 */
export async function requireAuth() {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return {
		user: {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name,
			role: session.user.role,
		},
	};
}

/**
 * 🛡️ ROLE-BASED ACCESS HELPER
 *
 * Check if user has a specific role
 *
 * USAGE:
 * ```ts
 * const auth = await requireRole("admin");
 * if (auth instanceof NextResponse) return auth; // Not admin
 * ```
 */
export async function requireRole(role: "user" | "admin") {
	const auth = await requireAuth();
	if (auth instanceof NextResponse) return auth;

	if (auth.user.role !== role) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	return auth;
}
