import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Member, MemberDocument } from '../entities/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';
type MemberWithStats = Member & {
    booksHeld: number;
    booksAtHome: number;
    readingInsideLibrary: number;
    totalFines: number;
    paidFines: number;
    fineHistory: any[];
    hasActiveIssues: boolean;
};
export declare class MembersService {
    private memberModel;
    private readonly httpService;
    private readonly activityLogService;
    private readonly redisEmitter;
    private readonly logger;
    constructor(memberModel: Model<MemberDocument>, httpService: HttpService, activityLogService: ActivityLogService, redisEmitter: RedisEmitterService);
    create(createMemberDto: CreateMemberDto, adminId?: string): Promise<Member>;
    findAll(token?: string, page?: number, limit?: number): Promise<{
        data: MemberWithStats[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, token?: string): Promise<MemberWithStats>;
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
    getMyStats(userId: string, token: string): Promise<{
        name: string;
        email: string;
        memberId: string;
        phone: string;
        address: string;
        memberSince: Date;
        totalRequests: number;
        booksRead: number;
        memId: string;
        paidFines: number;
        fineHistory: any[];
        totalFines: number;
    }>;
}
export {};
