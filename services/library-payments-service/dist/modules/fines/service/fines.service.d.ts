import { HttpService } from '@nestjs/axios';
import { Model, Types } from 'mongoose';
import { Fine, FineDocument, PaymentMethod } from '../entities/fine.entity';
import { CreateFineDto } from '../dto/create-fine.dto';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';
export declare class FinesService {
    private fineModel;
    private readonly httpService;
    private readonly redisEmitter;
    private razorpayInstance;
    private readonly logger;
    constructor(fineModel: Model<FineDocument>, httpService: HttpService, redisEmitter: RedisEmitterService);
    private sendPaymentNotification;
    private sendFineCreationNotification;
    createFine(data: CreateFineDto): Promise<Fine>;
    checkPendingFines(memberId: string): Promise<{
        hasPendingFines: boolean;
        totalPendingAmount: number;
        pendingFines: Fine[];
    }>;
    getFineById(id: string): Promise<FineDocument>;
    getAllFines(page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, FineDocument, {}, {}> & Fine & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getFinesByMemberId(memberId: string): Promise<Fine[]>;
    payFine(id: string, paymentMethod: PaymentMethod, referenceId?: string): Promise<Fine>;
    createRazorpayOrder(fineId: string): Promise<{
        orderId: any;
        amount: number;
        currency: string;
        fineId: string;
    }>;
    verifyRazorpayPayment(fineId: string, razorpayOrderId: string, razorpayPaymentId: string, signature: string): Promise<Fine>;
    updateFine(id: string, data: Partial<CreateFineDto>): Promise<Fine>;
    deleteFine(id: string): Promise<{
        message: string;
    }>;
    getInvoiceHtml(id: string, hideActions?: boolean): Promise<string>;
    sendInvoiceByEmail(id: string): Promise<void>;
    getInvoicePdf(id: string): Promise<Buffer>;
    getReportsData(startDate: string, endDate: string): Promise<{
        totalCollected: number;
        breakdown: {
            overdue: number;
            lost: number;
            damage: number;
        };
        recentTransactions: any[];
    }>;
    getPaymentsReport(): Promise<(import("mongoose").FlattenMaps<FineDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
