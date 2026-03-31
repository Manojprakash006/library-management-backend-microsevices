import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Member, MemberDocument } from '../entities/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';
type MemberWithStats = Member & {
    booksHeld: number;
    booksAtHome: number;
    readingInsideLibrary: number;
    totalFines: number;
    hasActiveIssues: boolean;
};
export declare class MembersService {
    private memberModel;
    private readonly httpService;
    private readonly activityLogService;
    private readonly logger;
    constructor(memberModel: Model<MemberDocument>, httpService: HttpService, activityLogService: ActivityLogService);
    create(createMemberDto: CreateMemberDto, adminId?: string): Promise<Member>;
    findAll(): Promise<MemberWithStats[]>;
    findOne(id: string): Promise<MemberWithStats>;
    findByMemberId(memberId: string): Promise<MemberWithStats>;
    update(id: string, updateData: Partial<CreateMemberDto>, adminId?: string): Promise<Member>;
    addBorrowingHistory(memberId: string, historyData: {
        bookId: string;
        issueId: string;
        borrowedAt: Date;
        dueDate: Date;
        status: 'borrowed' | 'returned' | 'overdue';
    }): Promise<void>;
    updateBorrowingHistory(memberId: string, issueId: string, updateData: {
        returnedAt: Date;
        fine: number;
        status: 'borrowed' | 'returned' | 'overdue';
    }): Promise<void>;
    remove(id: string, adminId?: string): Promise<void>;
    getActiveMembersCount(): Promise<number>;
    getInactiveMembersCount(): Promise<number>;
    getCount(): Promise<number>;
    private getMemberStatsFromIssues;
}
export {};
