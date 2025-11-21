/**import { handlers } from "@/lib/auth";

 * 📍 NextAuth API Routeexport const GET = handlers.GET;

 * export const POST = handlers.POST;

 * This file handles ALL NextAuth requests:
 * - /api/auth/signin → sign-in page or process login
 * - /api/auth/signout → sign-out page or process logout
 * - /api/auth/session → get current session
 * - /api/auth/providers → list available providers
 * - /api/auth/callback/credentials → process credential login
 * 
 * The [...nextauth] folder name is SPECIAL:
 * - It's a "catch-all" route
 * - Captures all paths under /api/auth/*
 * - NextAuth handles routing internally
 */

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Create the handler using your auth options
const handler = NextAuth(authOptions);

// Export for both GET and POST requests
// GET: Used for pages (sign-in form, etc.)
// POST: Used for form submissions (login, logout)
export { handler as GET, handler as POST };
