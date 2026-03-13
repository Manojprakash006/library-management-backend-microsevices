import { BookType, BookCondition, BookStatus } from '../entities/book.entity';
export declare class CreateBookDto {
    bookId: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publishYear: number;
    category: string;
    edition: string;
    language: string;
    pages: number;
    price: number;
    rackNumber: string;
    shelfNumber: string;
    bookType: BookType;
    condition: BookCondition;
    status: BookStatus;
    description: string;
    quantity: number;
    coverUrl: string;
}
