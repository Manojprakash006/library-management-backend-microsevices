import { Document, Types } from 'mongoose';
export type FavouriteDocument = Favourite & Document;
export declare class Favourite {
    userId: Types.ObjectId;
    bookId: Types.ObjectId;
}
export declare const FavouriteSchema: any;
