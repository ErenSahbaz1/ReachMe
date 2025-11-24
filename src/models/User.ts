import { Schema, model, models, Document } from "mongoose";

/**
 * 1️⃣ TypeScript interface for our User
 *
 * WHY: Gives us autocomplete and type safety
 * Document = adds _id, createdAt, etc.
 */
export interface IUser extends Document {
	email: string;
	name: string;
	passwordHash?: string; // Optional - OAuth users won't have passwords
	role: "user" | "admin";
	createdAt: Date;
	updatedAt: Date;
}

/**
 * 2️⃣ Define the schema (structure + validation)
 *
 * This is like a contract: "Every User document MUST have these fields"
 */
const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: [true, "Email is required"], // Error message if missing
			unique: true, // MongoDB creates an index to enforce uniqueness
			lowercase: true, // Auto-convert to lowercase
			trim: true, // Remove whitespace
			match: [/\S+@\S+\.\S+/, "Please enter a valid email"], // Basic email regex
		},
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			minlength: [2, "Name must be at least 2 characters"],
			maxlength: [50, "Name must be less than 50 characters"],
		},
		passwordHash: {
			type: String,
			required: false, // Optional for OAuth users (Google, etc.)
			select: false, // SECURITY: Don't include in queries by default
			// You must explicitly ask: User.findOne().select('+passwordHash')
		},
		role: {
			type: String,
			enum: {
				values: ["user", "admin"],
				message: "{VALUE} is not a valid role",
			},
			default: "user",
		},
	},
	{
		// Timestamps automatically add createdAt and updatedAt
		timestamps: true,
	}
);

/**
 * Indexes for performance
 *
 * WHY: Queries on 'email' will be instant (even with millions of users)
 * The unique: true above creates an index automatically
 * But we can add more for common queries:
 */
UserSchema.index({ role: 1 }); // If you query by role often

/**
 * Export the model with Next.js hot-reload handling
 *
 * PROBLEM: In dev, Next.js reloads modules → tries to create model again → crash
 * SOLUTION: Check if model already exists in mongoose.models
 */
const User = models.User || model<IUser>("User", UserSchema);

export default User;
