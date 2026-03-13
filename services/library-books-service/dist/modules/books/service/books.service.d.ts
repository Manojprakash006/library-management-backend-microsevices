import { Model } from 'mongoose';
import { Book, BookDocument } from '../entities/book.entity';
import { BookReview, BookReviewDocument } from '../entities/book-review.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookReviewDto } from '../dto/create-book-review.dto';
export declare class BooksService {
    private bookModel;
    private bookReviewModel;
    private readonly logger;
    constructor(bookModel: Model<BookDocument>, bookReviewModel: Model<BookReviewDocument>);
    create(createBookDto: CreateBookDto): Promise<Book>;
    findAll(): Promise<Book[]>;
    findOne(id: string): Promise<Book>;
    findByBookId(bookId: string): Promise<Book>;
    update(id: string, updateBookDto: UpdateBookDto): Promise<Book>;
    updateStatus(id: string, status: string): Promise<Book>;
    remove(id: string): Promise<void>;
    search(query: string): Promise<Book[]>;
    findByCategory(category: string): Promise<Book[]>;
    findByRack(rackNumber: string): Promise<Book[]>;
    createReview(createReviewDto: CreateBookReviewDto): Promise<BookReview>;
    findReviewsByBook(bookId: string): Promise<BookReview[]>;
    findReviewsByMember(memberId: string): Promise<BookReview[]>;
}
