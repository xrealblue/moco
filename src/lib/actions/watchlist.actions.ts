'use server'

import { WatchList } from "@/db/models/watchlist.model";
import { connectToDatabase } from "@/db/mongoose";


export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('Mongoose connection not found')

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');

        if (!userId) return [];

        const items = await WatchList.find({ userId }, { symbol: 1 }).lean();
        return items.map((i) => String(i.symbol));
    } catch (e) {
        console.error('Error fetching watchlist symbols for email:', e)
        return []
    }
}