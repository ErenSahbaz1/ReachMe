import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
	providers: [
	
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),

	
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				try {
					await dbConnect();
					const user = await User.findOne({
						email: credentials.email.toLowerCase(),
					}).select("+passwordHash");
					if (!user) return null;
					const isValid = await bcrypt.compare(
						credentials.password,
						user.passwordHash
					);
					if (!isValid) return null;
					return {
						id: user._id.toString(),
						email: user.email,
						name: user.name,
						role: user.role,
					};
				} catch (error) {
					console.error("Login error:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		/**
		 * 🔄 SIGN IN CALLBACK
		 *
		 * This runs when a user signs in with Google (or any OAuth provider).
		 * We check if the user exists in our database, and create them if not.
		 */
		async signIn({ user, account }: any) {
			// Only handle OAuth sign-ins (Google, etc.)
			if (account?.provider !== "credentials") {
				try {
					await dbConnect();

					// Check if user exists in our database
					let dbUser = await User.findOne({ email: user.email?.toLowerCase() });

					// If user doesn't exist, create them
					if (!dbUser) {
						dbUser = await User.create({
							email: user.email?.toLowerCase(),
							name: user.name || user.email?.split("@")[0],
							// No password hash for OAuth users
							passwordHash: "",
							role: "user",
						});
						console.log("Created new user from Google OAuth:", dbUser.email);
					}

					// Store the MongoDB user ID
					user.id = dbUser._id.toString();
					user.role = dbUser.role;
				} catch (error) {
					console.error("Error in signIn callback:", error);
					return false; // Deny sign in if there's an error
				}
			}
			return true; // Allow sign in
		},

		async jwt({ token, user, account }: any) {
			// When user first signs in
			if (user) {
				token.id = user.id;
				token.role = user.role || "user";
			}

			// For OAuth providers, ensure we have the user ID from database
			if (account?.provider !== "credentials" && !token.id) {
				try {
					await dbConnect();
					const dbUser = await User.findOne({
						email: token.email?.toLowerCase(),
					});
					if (dbUser) {
						token.id = dbUser._id.toString();
						token.role = dbUser.role;
					}
				} catch (error) {
					console.error("Error fetching user in JWT callback:", error);
				}
			}

			return token;
		},

		async session({ session, token }: any) {
			if (token) {
				session.user.id = token.id;
				session.user.role = token.role || "user";
			}
			return session;
		},
	},
	debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
