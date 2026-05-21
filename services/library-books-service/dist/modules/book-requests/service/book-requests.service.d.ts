import { Model } from 'mongoose';
import { BookRequest, BookRequestDocument } from '../entities/book-request.entity';
import { CreateBookRequestDto, UpdateBookRequestDto } from '../dto/create-book-request.dto';
export declare class BookRequestsService {
    private bookRequestModel;
    private readonly logger;
    constructor(bookRequestModel: Model<BookRequestDocument>);
    create(createBookRequestDto: CreateBookRequestDto): Promise<BookRequest>;
    findAll(): Promise<BookRequest[]>;
    findOne(id: string): Promise<BookRequest>;
    update(id: string, updateBookRequestDto: UpdateBookRequestDto): Promise<BookRequest>;
    approve(id: string, processedBy: string): Promise<BookRequest>;
    reject(id: string, processedBy: string): Promise<BookRequest>;
    remove(id: string): Promise<void>;
    findByMember(memberId: string): Promise<BookRequest[]>;
    cancel(id: string, memberId: string): Promise<void>;
}
