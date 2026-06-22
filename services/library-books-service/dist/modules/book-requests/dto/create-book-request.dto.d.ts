import { BookRequestStatus } from '../entities/book-request.entity';
export declare class CreateBookRequestDto {
    requestId: string;
    bookId: string;
    memberId: string;
    requestDate?: Date;
}
export declare class UpdateBookRequestDto {
    status: BookRequestStatus;
    currentlyBorrowed?: number;
    totalHistory?: number;
}
