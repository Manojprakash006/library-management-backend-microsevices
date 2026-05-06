import mongoose, { Model } from 'mongoose';
import { Member } from '../../members/entities/member.entity';
import { ReportDamageDto } from '../dto/report-damage.dto';
import { RenewBookDto } from '../dto/renew-book.dto';
import { SubmitReviewDto } from '../dto/submit-review.dto';
import { BookRequest } from '../shared/book-request.entity';
import { IssueBook } from '../shared/issue-book.entity';
import { Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
export declare class MemberDashboardService {
    private memberModel;
    private readonly httpService;
    private issueModel;
    private requestModel;
    logger: any;
    constructor(memberModel: Model<Member>, httpService: HttpService, issueModel: Model<IssueBook>, requestModel: Model<BookRequest>);
    private getMemberStatsFromIssues;
    getDashboardStats(userId: string): Promise<{
        issuedBooks: number;
        pendingRequests: number;
        activeReservations: number;
        overdueBooks: number;
        totalFines: number;
        takingHome: number;
        inLibrary: number;
    }>;
    getOverdueBooks(userId: string): Promise<any>;
    getRecentRequests(userId: string): Promise<any>;
    getCurrentlyBorrowedBooks(userId: string): Promise<any>;
    getBookDetails(issueId: string): Promise<mongoose.FlattenMaps<{
        bookId: Types.ObjectId;
        memberId: Types.ObjectId;
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
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMyBooks(userId: string): Promise<any>;
    reportBookDamage(damageDto: ReportDamageDto): Promise<{
        message: string;
        issueId: string;
    }>;
    renewBook(renewDto: RenewBookDto): Promise<any>;
    submitReview(userId: string, reviewDto: SubmitReviewDto): Promise<{
        bookId: string;
        rating: number;
        comment?: string;
        message: string;
        userId: string;
    }>;
    getMyReviews(userId: string, token: string): Promise<any>;
    getBookReviews(bookId: string, userId: string): Promise<any>;
    updateReview(reviewId: string, userId: string, data: any, token: string): Promise<any>;
}
