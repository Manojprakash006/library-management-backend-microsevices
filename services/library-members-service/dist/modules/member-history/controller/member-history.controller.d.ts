import { MemberHistoryService } from '../service/member-history.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { RequestBookAgainDto } from '../dto/request-book-again.dto';
export declare class MemberHistoryController {
    private readonly memberHistoryService;
    constructor(memberHistoryService: MemberHistoryService);
    getMemberHistory(req: any): Promise<{
        message: string;
        data: {
            bookId: string;
            issueId: string;
            bookTitle?: string;
            borrowedAt: Date;
            dueDate?: Date;
            returnedAt?: Date;
            status: "borrowed" | "returned" | "overdue";
            fine: number;
        }[];
    }>;
    requestBookAgain(req: any, requestDto: RequestBookAgainDto): Promise<{
        message: string;
        data: {
            message: string;
            bookId: string;
            memberId: string;
        };
    }>;
    getMemberReviews(req: any): Promise<{
        message: string;
        data: {
            bookId: string;
            rating: number;
            comment: string;
            createdAt: Date;
        }[];
    }>;
    createReview(req: any, reviewDto: CreateReviewDto): Promise<{
        message: string;
        data: {
            bookId: string;
            rating: number;
            comment: string;
            createdAt: Date;
        };
    }>;
    updateReview(id: string, reviewDto: UpdateReviewDto): Promise<{
        message: string;
        data: {
            rating?: number;
            comment?: string;
            message: string;
            reviewId: string;
        };
    }>;
    deleteReview(id: string): Promise<{
        message: string;
    }>;
}
