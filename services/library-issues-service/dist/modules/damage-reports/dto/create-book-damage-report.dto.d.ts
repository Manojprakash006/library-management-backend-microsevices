import { DamageReportReason, DamageReportStatus } from '../entities/book-damage-report.entity';
export declare class CreateBookDamageReportDto {
    reportId: string;
    issueId: string;
    bookId: string;
    memberId: string;
    reason: DamageReportReason;
    bookAmount: number;
    fineAmount: number;
    totalAmount: number;
}
export declare class UpdateBookDamageReportDto {
    status?: DamageReportStatus;
}
