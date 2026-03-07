import { Model } from 'mongoose';
import { Member } from '../../members/entities/member.entity';
export declare class StaffDashboardService {
    private memberModel;
    constructor(memberModel: Model<Member>);
    getStaffStats(): Promise<{
        totalMembers: number;
        totalBooks: number;
        booksIssued: number;
        booksReturned: number;
        overdueBooks: number;
        pendingRequests: number;
    }>;
    getRecentIssues(): Promise<any[]>;
    getOverdueBooks(): Promise<any[]>;
    getPendingRequests(): Promise<any[]>;
}
