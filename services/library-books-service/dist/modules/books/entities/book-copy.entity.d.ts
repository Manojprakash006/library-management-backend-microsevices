import { HydratedDocument, Types } from 'mongoose';
import { BookCondition, BookStatus } from './book.entity';
export type BookCopyDocument = HydratedDocument<BookCopy>;
export declare class BookCopy {
    bookId: Types.ObjectId;
    copyNumber: string;
    status: BookStatus;
    condition: BookCondition;
    barcode?: string;
    addedBy?: string;
}
export declare const BookCopySchema: import("mongoose").Schema<BookCopy, import("mongoose").Model<BookCopy, any, any, any, import("mongoose").Document<unknown, any, BookCopy, any, {}> & BookCopy & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BookCopy, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<BookCopy>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<BookCopy> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
