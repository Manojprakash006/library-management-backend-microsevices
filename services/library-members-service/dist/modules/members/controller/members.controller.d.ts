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
    getActiveCount(): Promise<{
        count: number;
    }>;
    getInactiveCount(): Promise<{
        count: number;
    }>;
    findAll(): Promise<{
        message: string;
        data: (import("../entities/member.entity").Member & {
            booksHeld: number;
            booksAtHome: number;
            readingInsideLibrary: number;
            totalFines: number;
            hasActiveIssues: boolean;
        })[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("../entities/member.entity").Member & {
            booksHeld: number;
            booksAtHome: number;
            readingInsideLibrary: number;
            totalFines: number;
            hasActiveIssues: boolean;
        };
    }>;
    findByMemberId(memberId: string): Promise<{
        message: string;
        data: import("../entities/member.entity").Member & {
            booksHeld: number;
            booksAtHome: number;
            readingInsideLibrary: number;
            totalFines: number;
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
}
