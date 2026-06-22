import { Document, Types } from 'mongoose';
export type FavouriteDocument = Favourite & Document;
export declare class Favourite {
    userId: Types.ObjectId;
    bookId: Types.ObjectId;
}
export declare const FavouriteSchema: import("mongoose").Schema<Favourite, import("mongoose").Model<Favourite, any, any, any, Document<unknown, any, Favourite, any, {}> & Favourite & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Favourite, Document<unknown, {}, import("mongoose").FlatRecord<Favourite>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Favourite> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
