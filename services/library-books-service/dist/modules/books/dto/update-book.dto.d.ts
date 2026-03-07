import { BookType, BookCondition } from '../entities/book.entity';
export declare class UpdateBookDto {
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
    description: string;
    quantity: number;
    coverUrl: string;
}
