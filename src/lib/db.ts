import mongoose from "mongoose";

// 1️⃣ Get the connection string from environment variables
// The "!" tells TypeScript "this definitely exists" (we check below anyway)
const MONGODB_URI = process.env.MONGODB_URI!;

// 2️⃣ Fail fast if the env var is missing
// Better to crash immediately than get weird errors later
if (!MONGODB_URI) {
	throw new Error("Please define MONGODB_URI in .env.local");
}

// 3️⃣ Create a type for our cache
// We store both the connection AND the promise (for concurrent calls)
type MongooseCache = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

// 4️⃣ Use Node.js global object to persist across hot-reloads
// In development, Next.js clears module cache but NOT global
// This prevents "too many connections" errors during dev
let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
	cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * 5️⃣ Main connection function
 *
 * HOW IT WORKS:
 * - First call: creates connection promise, waits, caches result
 * - Subsequent calls: returns cached connection instantly
 * - Concurrent calls: all wait for same promise (no duplicate connections)
 */
export async function dbConnect() {
	// Already connected? Return immediately
	if (cached.conn) {
		return cached.conn;
	}

	// Connection in progress? Wait for it
	if (!cached.promise) {
		const opts = {
			bufferCommands: false, // Fail fast if not connected (don't queue operations)
		};

		// Start connecting
		cached.promise = mongoose.connect(MONGODB_URI, opts);
	}

	// Wait for connection to finish
	try {
		cached.conn = await cached.promise;
	} catch (e) {
		// If connection fails, clear promise so next call tries again
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}
