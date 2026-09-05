import mongoose from "mongoose";

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

// Get MongoDB URI with proper type checking
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

// Throw error if not defined
if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI environment variable");
}

// Now TypeScript knows MONGODB_URI is definitely a string
const uri: string = MONGODB_URI;

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.conn) {
        console.log("✅ Using cached database connection");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("🔄 Connecting to MongoDB...");
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
        };

        cached.promise = mongoose.connect(uri, opts)
            .then((mongooseInstance) => {
                console.log("✅ Successfully connected to MongoDB");
                return mongooseInstance;
            })
            .catch((error) => {
                console.error("❌ MongoDB connection error:", error);
                cached.promise = null;
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectToDatabase;