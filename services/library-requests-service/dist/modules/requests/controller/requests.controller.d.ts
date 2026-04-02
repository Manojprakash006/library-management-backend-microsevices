import { RequestsService } from '../service/requests.service';
import { CreateBookRequestDto } from '../dto/create-book-request.dto';
import { BookRequest } from '../entities/book-request.entity';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(createDto: CreateBookRequestDto, req: any): Promise<{
        message: string;
        data: BookRequest;
    }>;
    findAll(): Promise<{
        message: string;
        data: BookRequest[];
        count: number;
    }>;
    getPendingCount(): Promise<{
        count: number;
    }>;
    getRequestsByMember(memberId: string): Promise<{
        data: BookRequest[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: BookRequest;
    }>;
    update(id: string, updateDto: Partial<CreateBookRequestDto>): Promise<{
        message: string;
        data: BookRequest;
    }>;
    cancel(id: string, req: any): Promise<{
        message: string;
        data: BookRequest;
    }>;
    approve(id: string, req: any): Promise<{
        message: string;
        data: BookRequest;
    }>;
    reject(id: string, req: any): Promise<{
        message: string;
        data: BookRequest;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
