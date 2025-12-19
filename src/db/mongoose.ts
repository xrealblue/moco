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

if(!cached) {
   cached = globalForMongo.mongooseCache = {conn: null, promise: null};
} // to not reload in development

