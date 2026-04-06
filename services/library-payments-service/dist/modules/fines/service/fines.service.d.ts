import { Model } from 'mongoose';
import { Fine, FineDocument, PaymentMethod } from '../entities/fine.entity';
export declare class FinesService {
    private fineModel;
    constructor(fineModel: Model<FineDocument>);
    createFine(data: {
        memberId: string;
        issueId: string;
        amount: number;
        reason: string;
    }): Promise<Fine>;
    checkPendingFines(memberId: string): Promise<{
        hasPendingFines: boolean;
        totalPendingAmount: number;
        pendingFines: Fine[];
    }>;
    getFineById(id: string): Promise<Fine>;
    getFinesByMemberId(memberId: string): Promise<Fine[]>;
    payFine(id: string, paymentMethod: PaymentMethod, referenceId?: string): Promise<Fine>;
}
