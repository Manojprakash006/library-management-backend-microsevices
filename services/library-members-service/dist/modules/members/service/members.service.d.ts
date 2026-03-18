import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Member, MemberDocument } from '../entities/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';
type MemberWithStats = Member & {
    booksHeld: number;
    booksAtHome: number;
    totalFines: number;
    hasActiveIssues: boolean;
};
export declare class MembersService {
    private memberModel;
    private readonly httpService;
    private readonly logger;
    constructor(memberModel: Model<MemberDocument>, httpService: HttpService);
    create(createMemberDto: CreateMemberDto): Promise<Member>;
    findAll(): Promise<MemberWithStats[]>;
    findOne(id: string): Promise<MemberWithStats>;
    findByMemberId(memberId: string): Promise<MemberWithStats>;
    update(id: string, updateData: Partial<CreateMemberDto>): Promise<Member>;
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
    remove(id: string): Promise<void>;
    getActiveMembersCount(): Promise<number>;
    getInactiveMembersCount(): Promise<number>;
    getCount(): Promise<number>;
    private getMemberStatsFromIssues;
}
export {};
