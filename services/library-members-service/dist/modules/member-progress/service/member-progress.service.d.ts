import { HttpService } from '@nestjs/axios';
export declare class MemberProgressService {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    getSummary(memberId: string, authHeader?: string): Promise<{
        booksIssued: any;
        booksReturned: any;
        renewedBooks: any;
        overdueBooks: any;
        finePaid: number;
        lostOrDamaged: any;
    }>;
}
