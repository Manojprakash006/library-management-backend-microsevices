import { Model } from 'mongoose';
import { BookDamageReport, BookDamageReportDocument } from '../entities/book-damage-report.entity';
import { CreateBookDamageReportDto } from '../dto/create-book-damage-report.dto';
export declare class DamageReportsService {
    private bookDamageReportModel;
    private readonly logger;
    constructor(bookDamageReportModel: Model<BookDamageReportDocument>);
    create(createBookDamageReportDto: CreateBookDamageReportDto): Promise<BookDamageReport>;
    findAll(status?: string): Promise<BookDamageReport[]>;
    findOne(id: string): Promise<BookDamageReport>;
    approve(id: string): Promise<BookDamageReport>;
    reject(id: string): Promise<BookDamageReport>;
    remove(id: string): Promise<void>;
}
