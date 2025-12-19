import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
   var mongooseCache: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
   } | undefined;
}

const globalForMongo = globalThis as typeof globalThis & {
   mongooseCache?: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
   }
};

let cached = globalForMongo.mongooseCache;

if (!cached) {
   cached = globalForMongo.mongooseCache = { conn: null, promise: null };
} // to not reload in development

export const connectToDatabase = async () => {
   if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
   }

   if (cached.conn) {
      return cached.conn;
   }

   if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
   }

   try {
      cached.conn = await cached.promise;
   } catch (err) {
      cached.promise = null;
      throw err;
   }

   console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`);

   return cached.conn;
}