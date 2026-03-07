import { ReviewStatus } from '../entities/book-review.entity';
export declare class CreateBookReviewDto {
    bookId: string;
    memberId: string;
    rating: number;
    reviewTitle: string;
    review: string;
    recommended: boolean;
    status: ReviewStatus;
}
