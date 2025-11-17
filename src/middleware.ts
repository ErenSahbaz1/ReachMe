import { withAuth } from "next-auth/middleware";

export default withAuth({
	callbacks: {
		authorized: ({ token, req }) => {
			const url = req.nextUrl.pathname;
			// Require auth on mutating endpoints
			if (req.method !== "GET" && url.startsWith("/api/")) return !!token;
			return true;
		},
	},
});

export const config = { matcher: ["/api/:path*"] };
