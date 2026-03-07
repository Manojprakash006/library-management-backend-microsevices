import { Model } from 'mongoose';
import { Member } from '../../members/entities/member.entity';
import { ReportDamageDto } from '../dto/report-damage.dto';
import { RenewBookDto } from '../dto/renew-book.dto';
import { SubmitReviewDto } from '../dto/submit-review.dto';
export declare class MemberDashboardService {
    private memberModel;
    constructor(memberModel: Model<Member>);
    getMemberStats(userId: string): Promise<{
        totalBorrowed: number;
        currentlyBorrowed: number;
        overdueBooks: number;
        pendingRequests: number;
    }>;
    getOverdueBooks(userId: string): Promise<any[]>;
    getRecentRequests(userId: string): Promise<any[]>;
    getCurrentlyBorrowedBooks(userId: string): Promise<any[]>;
    getBookDetails(issueId: string): Promise<{
        issueId: string;
    }>;
    getMyBooks(userId: string): Promise<any[]>;
    reportBookDamage(damageDto: ReportDamageDto): Promise<{
        message: string;
        bookId: string;
    }>;
    renewBook(renewDto: RenewBookDto): Promise<{
        message: string;
        bookId: string;
    }>;
    submitReview(userId: string, reviewDto: SubmitReviewDto): Promise<{
        bookId: string;
        rating: number;
        comment?: string;
        message: string;
        userId: string;
    }>;
}
