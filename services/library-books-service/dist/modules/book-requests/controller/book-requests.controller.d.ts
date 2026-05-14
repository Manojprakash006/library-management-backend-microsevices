import { BookRequestsService } from '../service/book-requests.service';
import { CreateBookRequestDto, UpdateBookRequestDto } from '../dto/create-book-request.dto';
import { BookRequest } from '../entities/book-request.entity';
export declare class BookRequestsController {
    private readonly bookRequestsService;
    constructor(bookRequestsService: BookRequestsService);
    create(createBookRequestDto: CreateBookRequestDto): Promise<{
        message: string;
        data: BookRequest;
    }>;
    findAll(): Promise<{
        message: string;
        data: BookRequest[];
        count: number;
    }>;
    getMemberRequests(req: any): Promise<{
        message: string;
        data: BookRequest[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: BookRequest;
    }>;
    update(id: string, updateBookRequestDto: UpdateBookRequestDto): Promise<{
        message: string;
        data: BookRequest;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    cancel(id: string, req: any): Promise<{
        message: string;
    }>;
    approve(id: string): Promise<{
        message: string;
        data: BookRequest;
    }>;
    reject(id: string): Promise<{
        message: string;
        data: BookRequest;
    }>;
}
