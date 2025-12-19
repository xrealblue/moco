import { model, Model, models, Schema, type Document } from "mongoose";


export interface IWatchlistItem extends Document {
    userId: string;
    symbol: string;
    company: string;
    addedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlistItem>({
    userId: { type: String, required: true },
    symbol: { type: String, required: true },
    company: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
});

WatchlistSchema.index({userId: 1, symbol: 1}, {unique: true});

export const WatchList: Model<IWatchlistItem> = (models?.WatchList as Model<IWatchlistItem>) || model<IWatchlistItem>('WatchList', WatchlistSchema);