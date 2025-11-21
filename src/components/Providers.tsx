"use client";

/**
 * 🔐 SESSION PROVIDER WRAPPER
 * 
 * This wraps the app with NextAuth's SessionProvider
 * so we can use useSession() in Client Components.
 * 
 * WHY A SEPARATE FILE?
 * - layout.tsx is a Server Component
 * - SessionProvider needs "use client"
 * - We isolate the client boundary here
 */

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
	return <SessionProvider>{children}</SessionProvider>;
}
