import { HydratedDocument, Types } from 'mongoose';
export type BookReviewDocument = HydratedDocument<BookReview>;
export declare enum ReviewStatus {
    PUBLISHED = "Published",
    DRAFT = "Draft"
}
export declare class BookReview {
    bookId: Types.ObjectId;
    memberId: Types.ObjectId;
    rating: number;
    reviewTitle: string;
    review: string;
    recommended: boolean;
    status: ReviewStatus;
    reviewDate: Date;
}
export declare const BookReviewSchema: import("mongoose").Schema<BookReview, import("mongoose").Model<BookReview, any, any, any, import("mongoose").Document<unknown, any, BookReview, any, {}> & BookReview & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BookReview, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<BookReview>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<BookReview> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
