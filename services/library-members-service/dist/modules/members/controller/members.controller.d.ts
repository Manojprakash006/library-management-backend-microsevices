import { MembersService } from '../service/members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    create(createMemberDto: CreateMemberDto, req: any): Promise<{
        message: string;
        data: import("../entities/member.entity").Member;
    }>;
    getActiveCount(): Promise<{
        data: number;
    }>;
    getInactiveCount(): Promise<{
        data: number;
    }>;
    getCount(): Promise<{
        data: number;
    }>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        message: string;
        data: (import("../entities/member.entity").Member & {
            booksHeld: number;
            booksAtHome: number;
            readingInsideLibrary: number;
            totalFines: number;
            paidFines: number;
            fineHistory: any[];
            hasActiveIssues: boolean;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getFooterStats(req: any): Promise<{
        message: string;
        data: {
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
        };
    }>;
    findOne(id: string, req: any): Promise<{
        message: string;
        data: import("../entities/member.entity").Member & {
            booksHeld: number;
            booksAtHome: number;
            readingInsideLibrary: number;
            totalFines: number;
            paidFines: number;
            fineHistory: any[];
            hasActiveIssues: boolean;
        };
    }>;
    update(id: string, updateData: Partial<CreateMemberDto>, req: any): Promise<{
        message: string;
        data: import("../entities/member.entity").Member;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    addBorrowingHistory(id: string, historyData: any): Promise<{
        message: string;
    }>;
    updateBorrowingHistory(id: string, updateData: any): Promise<{
        message: string;
    }>;
}
