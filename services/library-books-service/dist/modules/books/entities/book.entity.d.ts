import { HydratedDocument } from 'mongoose';
export type BookDocument = HydratedDocument<Book>;
export declare enum BookType {
    ISSUE_BOOK = "Issue Book",
    REFERENCE_BOOK = "Reference Book"
}
export declare enum BookCondition {
    NEW = "New",
    GOOD = "Good",
    FAIR = "Fair",
    POOR = "Poor",
    DAMAGED = "Damaged"
}
export declare class Book {
    bookId: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publishYear: number;
    category: string;
    edition: string;
    language: string;
    pages: number;
    price: number;
    rackNumber: string;
    shelfNumber: string;
    bookType: BookType;
    condition: BookCondition;
    description: string;
    quantity: number;
    coverUrl: string;
}
export declare const BookSchema: import("mongoose").Schema<Book, import("mongoose").Model<Book, any, any, any, import("mongoose").Document<unknown, any, Book, any, {}> & Book & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Book, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Book>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Book> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
