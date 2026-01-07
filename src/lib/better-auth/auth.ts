import { connectToDatabase } from "@/db/mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;
// prevents multiple connections

export const getAuth = async () => {
    if (authInstance) {
        return authInstance;
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
        throw new Error("Failde to connect Db")
    }

    authInstance = betterAuth({
        database: mongodbAdapter(db as any),

        secret: process.env.BETTER_AUTH_SECRET,

        baseURL: process.env.BETTER_AUTH_URL,
        cookies: {
            secure: false,     
            sameSite: "lax",
        },
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 6,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugin: [nextCookies()],
    });

    return authInstance;
}

export const auth = await getAuth();