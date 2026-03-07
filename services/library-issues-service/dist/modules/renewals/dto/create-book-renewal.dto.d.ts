import { RenewalStatus } from '../entities/book-renewal.entity';
export declare class CreateBookRenewalDto {
    renewalId: string;
    issueId: string;
    memberId: string;
    currentDueDate: Date;
    newDueDate: Date;
}
export declare class UpdateBookRenewalDto {
    status?: RenewalStatus;
}
