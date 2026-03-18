import { MembersService } from '../service/members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { Member } from '../entities/member.entity';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    create(createMemberDto: CreateMemberDto): Promise<{
        message: string;
        data: Member;
    }>;
    getCount(): Promise<{
        count: number;
    }>;
    getActiveCount(): Promise<{
        count: number;
    }>;
    getInactiveCount(): Promise<{
        count: number;
    }>;
    findAll(): Promise<{
        message: string;
        data: Member[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: Member;
    }>;
    update(id: string, updateData: Partial<CreateMemberDto>): Promise<{
        message: string;
        data: Member;
    }>;
    addBorrowingHistory(id: string, historyData: {
        bookId: string;
        issueId: string;
        borrowedAt: Date;
        dueDate: Date;
        status: 'borrowed' | 'returned' | 'overdue';
    }): Promise<{
        message: string;
    }>;
    updateBorrowingHistory(id: string, issueId: string, updateData: {
        returnedAt: Date;
        fine: number;
        status: 'borrowed' | 'returned' | 'overdue';
    }): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
