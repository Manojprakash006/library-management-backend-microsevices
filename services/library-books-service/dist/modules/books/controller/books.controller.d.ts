import { BooksService } from '../service/books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookReviewDto } from '../dto/create-book-review.dto';
import { Book, BookStatus, BookCondition } from '../entities/book.entity';
import { BookCopy } from '../entities/book-copy.entity';
import { BookReview } from '../entities/book-review.entity';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    getCollectionStats(): Promise<{
        message: string;
        data: any;
    }>;
    getTopReviews(): Promise<{
        message: string;
        data: any[];
    }>;
    create(createBookDto: CreateBookDto, req: any): Promise<{
        message: string;
        data: Book;
    }>;
    findAll(page?: string, limit?: string): Promise<{
        message: string;
        data: Book[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    search(query: string): Promise<{
        message: string;
        data: Book[];
        count: number;
    }>;
    findByCategory(category: string): Promise<{
        message: string;
        data: Book[];
        count: number;
    }>;
    findAllCategories(): Promise<{
        message: string;
        data: string[];
    }>;
    checkReview(bookId: string, memberId: string): Promise<{
        reviewed: boolean;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: Book;
    }>;
    findCopies(id: string): Promise<{
        message: string;
        data: BookCopy[];
    }>;
    getReviewsByBook(bookId: string): Promise<{
        message: string;
        data: BookReview[];
    }>;
    toggleLike(reviewId: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateBookDto: UpdateBookDto, req: any): Promise<{
        message: string;
        data: Book;
    }>;
    updateStatus(id: string, status: string): Promise<{
        message: string;
        data: Book;
    }>;
    updateCopyStatus(copyNumber: string, status: BookStatus, condition?: BookCondition): Promise<{
        message: string;
        data: BookCopy;
    }>;
    updateConditionQuantity(id: string, condition: string, change: number): Promise<{
        message: string;
        data: Book;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    createReview(createReviewDto: CreateBookReviewDto, req: any): Promise<{
        message: string;
        data: BookReview;
    }>;
    getMyReviews(userId: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    updateReview(reviewId: string, updateData: any, req: any): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    deleteReview(reviewId: string, req: any): Promise<{
        message: string;
    }>;
}
