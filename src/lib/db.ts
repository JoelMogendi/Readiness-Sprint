import mongoose from "mongoose";

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
};

// fetch connection
const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI) {
    throw new Error("Please define MongoDb_URI");
};

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
};

export async function connectToDatabase () {
    if(cached.conn) {
        return cached.conn;
    };

    if(!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
            console.log("Successfully connected to MongoDB");
            return mongooseInstance;
        });
    };

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};