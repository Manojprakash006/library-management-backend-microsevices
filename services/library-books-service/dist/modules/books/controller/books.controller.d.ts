import { BooksService } from '../service/books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookReviewDto } from '../dto/create-book-review.dto';
import { Book } from '../entities/book.entity';
import { BookReview } from '../entities/book-review.entity';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(createBookDto: CreateBookDto): Promise<{
        message: string;
        data: Book;
    }>;
    findAll(): Promise<{
        message: string;
        data: Book[];
        count: number;
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
    findOne(id: string): Promise<{
        message: string;
        data: Book;
    }>;
    update(id: string, updateBookDto: UpdateBookDto): Promise<{
        message: string;
        data: Book;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    createReview(createReviewDto: CreateBookReviewDto): Promise<{
        message: string;
        data: BookReview;
    }>;
    findReviewsByBook(bookId: string): Promise<{
        message: string;
        data: BookReview[];
        count: number;
    }>;
}
