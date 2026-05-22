import { Response } from 'express';
import { FinesService } from '../service/fines.service';
import { PayFineDto } from '../dto/pay-fine.dto';
import { CreateFineDto } from '../dto/create-fine.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
export declare class FinesController {
    private readonly finesService;
    constructor(finesService: FinesService);
    getAllFines(page?: string, limit?: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../entities/fine.entity").FineDocument, {}, {}> & import("../entities/fine.entity").Fine & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getFinesByMemberId(memberId: string): Promise<{
        message: string;
        data: import("../entities/fine.entity").Fine[];
    }>;
    getFineById(id: string): Promise<{
        message: string;
        data: import("../entities/fine.entity").FineDocument;
    }>;
    checkPendingFines(memberId: string): Promise<{
        message: string;
        data: {
            hasPendingFines: boolean;
            totalPendingAmount: number;
            pendingFines: import("../entities/fine.entity").Fine[];
        };
    }>;
    createFine(createFineDto: CreateFineDto): Promise<{
        message: string;
        data: import("../entities/fine.entity").Fine;
    }>;
    payFine(id: string, payFineDto: PayFineDto): Promise<{
        message: string;
        data: import("../entities/fine.entity").Fine;
    }>;
    createRazorpayOrder(id: string): Promise<{
        message: string;
        data: {
            orderId: any;
            amount: number;
            currency: string;
            fineId: string;
        };
    }>;
    verifyRazorpayPayment(verifyPaymentDto: VerifyPaymentDto): Promise<{
        message: string;
        data: import("../entities/fine.entity").Fine;
    }>;
    updateFine(id: string, data: any): Promise<import("../entities/fine.entity").Fine>;
    deleteFine(id: string): Promise<{
        message: string;
    }>;
    getInvoice(id: string): Promise<string>;
    downloadInvoicePdf(id: string, res: Response): Promise<void>;
    getReportsData(startDate: string, endDate: string): Promise<{
        totalCollected: number;
        breakdown: {
            overdue: number;
            lost: number;
            damage: number;
        };
        recentTransactions: any[];
    }>;
    getPaymentsReport(): Promise<(import("mongoose").FlattenMaps<import("../entities/fine.entity").FineDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
