import { RenewalsService } from '../service/renewals.service';
import { CreateBookRenewalDto } from '../dto/create-book-renewal.dto';
import { BookRenewal } from '../entities/book-renewal.entity';
export declare class RenewalsController {
    private readonly renewalsService;
    constructor(renewalsService: RenewalsService);
    create(createBookRenewalDto: CreateBookRenewalDto): Promise<{
        message: string;
        data: BookRenewal;
    }>;
    findAll(status?: string): Promise<{
        message: string;
        data: BookRenewal[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: BookRenewal;
    }>;
    approve(id: string): Promise<{
        message: string;
        data: BookRenewal;
    }>;
    reject(id: string): Promise<{
        message: string;
        data: BookRenewal;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
