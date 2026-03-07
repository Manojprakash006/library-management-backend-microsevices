import { DamageReportsService } from '../service/damage-reports.service';
import { CreateBookDamageReportDto } from '../dto/create-book-damage-report.dto';
import { BookDamageReport } from '../entities/book-damage-report.entity';
export declare class DamageReportsController {
    private readonly damageReportsService;
    constructor(damageReportsService: DamageReportsService);
    create(createBookDamageReportDto: CreateBookDamageReportDto): Promise<{
        message: string;
        data: BookDamageReport;
    }>;
    findAll(status?: string): Promise<{
        message: string;
        data: BookDamageReport[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: BookDamageReport;
    }>;
    approve(id: string): Promise<{
        message: string;
        data: BookDamageReport;
    }>;
    reject(id: string): Promise<{
        message: string;
        data: BookDamageReport;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
