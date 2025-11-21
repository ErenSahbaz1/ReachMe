import "next-auth";

/**
 * 🔧 NextAuth Type Extensions
 *
 * By default, NextAuth session only has: name, email, image
 * We want to add: id, role
 *
 * This "module augmentation" tells TypeScript about our custom fields
 */
declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			role: string;
		};
	}

	interface User {
		id: string;
		email: string;
		name: string;
		role: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
	}
}
