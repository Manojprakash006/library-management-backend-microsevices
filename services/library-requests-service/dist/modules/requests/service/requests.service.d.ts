import { Model } from 'mongoose';
import { BookRequest, BookRequestDocument } from '../entities/book-request.entity';
import { CreateBookRequestDto } from '../dto/create-book-request.dto';
export declare class RequestsService {
    private bookRequestModel;
    private readonly logger;
    constructor(bookRequestModel: Model<BookRequestDocument>);
    create(createDto: CreateBookRequestDto): Promise<BookRequest>;
    findAll(): Promise<BookRequest[]>;
    findOne(id: string): Promise<BookRequest>;
    findByMember(memberId: string): Promise<BookRequest[]>;
    update(id: string, updateDto: Partial<CreateBookRequestDto>): Promise<BookRequest>;
    cancel(id: string, memberId: string): Promise<BookRequest>;
    approve(id: string): Promise<BookRequest>;
    reject(id: string): Promise<BookRequest>;
    remove(id: string): Promise<void>;
    getPendingCount(): Promise<number>;
}
