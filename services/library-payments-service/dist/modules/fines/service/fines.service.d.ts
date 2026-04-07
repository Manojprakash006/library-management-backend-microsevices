import { Model } from 'mongoose';
import { Fine, FineDocument, PaymentMethod } from '../entities/fine.entity';
export declare class FinesService {
    private fineModel;
    private razorpayInstance;
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
    getFineById(id: string): Promise<FineDocument>;
    getFinesByMemberId(memberId: string): Promise<Fine[]>;
    payFine(id: string, paymentMethod: PaymentMethod, referenceId?: string): Promise<Fine>;
    createRazorpayOrder(fineId: string): Promise<{
        orderId: any;
        amount: number;
        currency: string;
        fineId: string;
    }>;
    verifyRazorpayPayment(fineId: string, razorpayOrderId: string, razorpayPaymentId: string, signature: string): Promise<Fine>;
}
