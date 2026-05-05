import { MemberDashboardService } from '../service/member-dashboard.service';
import { ReportDamageDto } from '../dto/report-damage.dto';
import { RenewBookDto } from '../dto/renew-book.dto';
import { SubmitReviewDto } from '../dto/submit-review.dto';
export declare class MemberDashboardController {
    private readonly memberDashboardService;
    constructor(memberDashboardService: MemberDashboardService);
    getMemberStats(req: any): Promise<{
        message: string;
        data: {
            issuedBooks: number;
            pendingRequests: number;
            activeReservations: number;
            overdueBooks: number;
            totalFines: number;
            takingHome: number;
            inLibrary: number;
        };
    }>;
    getOverdueBooks(req: any): Promise<{
        message: string;
        data: any;
    }>;
    getRecentRequests(req: any): Promise<{
        message: string;
        data: any;
    }>;
    getCurrentlyBorrowedBooks(req: any): Promise<{
        message: string;
        data: any;
    }>;
    getBookDetails(issueId: string): Promise<{
        message: string;
        data: import("mongoose").FlattenMaps<{
            bookId: import("mongoose").Types.ObjectId;
            memberId: import("mongoose").Types.ObjectId;
            issueType: import("../shared/issue-book.entity").IssueType;
            numberOfDays: number;
            issueDate: Date;
            dueDate: Date;
            returnDate: Date;
            status: import("../shared/issue-book.entity").IssueStatus;
            daysOverdue: number;
            fine: number;
            finePerDay: number;
        }> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    getMyBooks(req: any): Promise<{
        message: string;
        data: any;
    }>;
    reportBookDamage(damageDto: ReportDamageDto): Promise<{
        message: string;
        data: {
            message: string;
            issueId: string;
        };
    }>;
    renewBook(renewDto: RenewBookDto): Promise<{
        message: string;
        data: any;
    }>;
    submitReview(req: any, reviewDto: SubmitReviewDto): Promise<{
        message: string;
        data: {
            bookId: string;
            rating: number;
            comment?: string;
            message: string;
            userId: string;
        };
    }>;
    getMyReviews(req: any): Promise<{
        message: string;
        data: any;
    }>;
    getBookReviews(bookId: string, req: any): Promise<{
        message: string;
        data: any;
    }>;
    updateReview(reviewId: string, req: any, data: any): Promise<{
        message: string;
        data: any;
    }>;
}
