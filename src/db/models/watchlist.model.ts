import { type Document } from "mongoose";


export interface IWatchlistItem extends Document {
    userId: string;
    sybol: string;
    company: string;
    addedAt: Date;
}