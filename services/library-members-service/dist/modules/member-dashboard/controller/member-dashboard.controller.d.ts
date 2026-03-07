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
            totalBorrowed: number;
            currentlyBorrowed: number;
            overdueBooks: number;
            pendingRequests: number;
        };
    }>;
    getOverdueBooks(req: any): Promise<{
        message: string;
        data: any[];
    }>;
    getRecentRequests(req: any): Promise<{
        message: string;
        data: any[];
    }>;
    getCurrentlyBorrowedBooks(req: any): Promise<{
        message: string;
        data: any[];
    }>;
    getBookDetails(issueId: string): Promise<{
        message: string;
        data: {
            issueId: string;
        };
    }>;
    getMyBooks(req: any): Promise<{
        message: string;
        data: any[];
    }>;
    reportBookDamage(damageDto: ReportDamageDto): Promise<{
        message: string;
        data: {
            message: string;
            bookId: string;
        };
    }>;
    renewBook(renewDto: RenewBookDto): Promise<{
        message: string;
        data: {
            message: string;
            bookId: string;
        };
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
}
