import { Model } from 'mongoose';
import { Member } from '../../members/entities/member.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { RequestBookAgainDto } from '../dto/request-book-again.dto';
export declare class MemberHistoryService {
    private memberModel;
    constructor(memberModel: Model<Member>);
    getMemberHistory(userId: string): Promise<{
        bookId: string;
        bookTitle?: string;
        borrowedAt: Date;
        returnedAt?: Date;
        status: "borrowed" | "returned" | "overdue";
    }[]>;
    requestBookAgain(userId: string, requestDto: RequestBookAgainDto): Promise<{
        message: string;
        bookId: string;
        memberId: string;
    }>;
    getMemberReviews(userId: string): Promise<{
        bookId: string;
        rating: number;
        comment: string;
        createdAt: Date;
    }[]>;
    createReview(userId: string, reviewDto: CreateReviewDto): Promise<{
        bookId: string;
        rating: number;
        comment: string;
        createdAt: Date;
    }>;
    updateReview(reviewId: string, reviewDto: UpdateReviewDto): Promise<{
        rating?: number;
        comment?: string;
        message: string;
        reviewId: string;
    }>;
    deleteReview(reviewId: string): Promise<{
        message: string;
        reviewId: string;
    }>;
}
