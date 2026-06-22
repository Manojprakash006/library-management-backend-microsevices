import { MemberProgressService } from '../service/member-progress.service';
export declare class MemberProgressController {
    private readonly memberProgressService;
    constructor(memberProgressService: MemberProgressService);
    getSummary(memberId: string, req: any): Promise<{
        booksIssued: any;
        booksReturned: any;
        renewedBooks: any;
        overdueBooks: any;
        finePaid: number;
        lostOrDamaged: any;
    }>;
}
