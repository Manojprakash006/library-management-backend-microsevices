import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { BookRequest, BookRequestDocument } from '../entities/book-request.entity';
import { CreateBookRequestDto } from '../dto/create-book-request.dto';
export declare class RequestsService {
    private bookRequestModel;
    private readonly httpService;
    private readonly logger;
    constructor(bookRequestModel: Model<BookRequestDocument>, httpService: HttpService);
    private logActivity;
    private sendNotification;
    private notifyAdmins;
    create(createDto: CreateBookRequestDto): Promise<BookRequest>;
    private getMemberBorrowingDetails;
    findAll(): Promise<any[]>;
    getByMember(memberId: string): Promise<BookRequest[]>;
    findOne(id: string): Promise<BookRequest>;
    update(id: string, updateDto: Partial<CreateBookRequestDto>): Promise<BookRequest>;
    cancel(id: string, memberId: string): Promise<BookRequest>;
    approve(id: string, adminId?: string): Promise<BookRequest>;
    reject(id: string, adminId?: string): Promise<BookRequest>;
    remove(id: string): Promise<void>;
    getPendingCount(): Promise<number>;
}
