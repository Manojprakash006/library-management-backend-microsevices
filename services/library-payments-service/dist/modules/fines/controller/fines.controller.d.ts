import { FinesService } from '../service/fines.service';
import { PayFineDto } from '../dto/pay-fine.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
export declare class FinesController {
    private readonly finesService;
    constructor(finesService: FinesService);
    getFinesByMemberId(memberId: string): Promise<import("../entities/fine.entity").Fine[]>;
    getFineById(id: string): Promise<import("../entities/fine.entity").FineDocument>;
    checkPendingFines(memberId: string): Promise<{
        hasPendingFines: boolean;
        totalPendingAmount: number;
        pendingFines: import("../entities/fine.entity").Fine[];
    }>;
    createFine(createFineDto: {
        memberId: string;
        issueId: string;
        amount: number;
        reason: string;
    }): Promise<import("../entities/fine.entity").Fine>;
    payFine(id: string, payFineDto: PayFineDto): Promise<import("../entities/fine.entity").Fine>;
    createRazorpayOrder(id: string): Promise<{
        orderId: any;
        amount: number;
        currency: string;
        fineId: string;
    }>;
    verifyRazorpayPayment(verifyPaymentDto: VerifyPaymentDto): Promise<import("../entities/fine.entity").Fine>;
}
