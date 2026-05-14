import { HydratedDocument, Types } from 'mongoose';
export type BookReviewDocument = HydratedDocument<BookReview>;
export declare enum ReviewStatus {
    PUBLISHED = "Published",
    DRAFT = "Draft"
}
export declare class BookReview {
    bookId: Types.ObjectId;
    memberId: Types.ObjectId;
    memberName: string;
    rating: number;
    reviewTitle: string;
    review: string;
    recommended: boolean;
    status: ReviewStatus;
    reviewDate: Date;
    likedBy: string[];
    likeCount: number;
}
export declare const BookReviewSchema: any;
