import { Model } from 'mongoose';
import { BookRenewal, BookRenewalDocument } from '../entities/book-renewal.entity';
import { CreateBookRenewalDto } from '../dto/create-book-renewal.dto';
export declare class RenewalsService {
    private bookRenewalModel;
    private readonly logger;
    constructor(bookRenewalModel: Model<BookRenewalDocument>);
    create(createBookRenewalDto: CreateBookRenewalDto): Promise<BookRenewal>;
    findAll(status?: string): Promise<BookRenewal[]>;
    findOne(id: string): Promise<BookRenewal>;
    approve(id: string): Promise<BookRenewal>;
    reject(id: string): Promise<BookRenewal>;
    remove(id: string): Promise<void>;
}
