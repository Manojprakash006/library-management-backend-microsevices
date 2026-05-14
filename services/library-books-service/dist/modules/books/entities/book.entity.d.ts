import { HydratedDocument } from 'mongoose';
export type BookDocument = HydratedDocument<Book>;
export declare enum BookType {
    ISSUE_BOOK = "Issue Book",
    REFERENCE_BOOK = "Reference Book"
}
export declare enum BookCondition {
    NEW = "New",
    GOOD = "Good",
    FAIR = "Fair",
    POOR = "Poor",
    DAMAGED = "Damaged"
}
export declare enum BookStatus {
    AVAILABLE = "available",
    ISSUED = "issued",
    MAINTENANCE = "maintenance",
    LOST = "lost",
    DAMAGED = "damaged"
}
export declare class Book {
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
    damagedQuantity: number;
    lostQuantity: number;
    coverUrl: string;
    rating: number;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const BookSchema: any;
