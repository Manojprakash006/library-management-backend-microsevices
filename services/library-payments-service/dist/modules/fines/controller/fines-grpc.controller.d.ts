import { FinesService } from '../service/fines.service';
export declare class FinesGrpcController {
    private readonly finesService;
    private readonly logger;
    constructor(finesService: FinesService);
    createFine(data: {
        memberId: string;
        issueId: string;
        amount: number;
        reason: string;
    }): Promise<{
        id: any;
        memberId: any;
        issueId: any;
        amount: any;
        reason: any;
        status: any;
        paymentMethod: any;
        paidAt: any;
        referenceId: any;
        createdAt: any;
        updatedAt: any;
    }>;
    checkPendingFines(data: {
        memberId: string;
    }): Promise<{
        hasPendingFines: boolean;
        totalPendingAmount: number;
        pendingFines: {
            id: any;
            memberId: any;
            issueId: any;
            amount: any;
            reason: any;
            status: any;
            paymentMethod: any;
            paidAt: any;
            referenceId: any;
            createdAt: any;
            updatedAt: any;
        }[];
    }>;
    getFine(data: {
        id: string;
    }): Promise<{
        id: any;
        memberId: any;
        issueId: any;
        amount: any;
        reason: any;
        status: any;
        paymentMethod: any;
        paidAt: any;
        referenceId: any;
        createdAt: any;
        updatedAt: any;
    }>;
    private mapFineToResponse;
}
