import { Model, Types } from 'mongoose';
import { Book, BookDocument, BookStatus, BookCondition } from '../entities/book.entity';
import { BookCopy, BookCopyDocument } from '../entities/book-copy.entity';
import { BookReview, BookReviewDocument } from '../entities/book-review.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookReviewDto } from '../dto/create-book-review.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '../../library-config/service/config.service';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';
export declare class BooksService {
    private bookModel;
    private bookReviewModel;
    private bookCopyModel;
    private readonly httpService;
    private readonly configService;
    private readonly redisEmitter;
    private readonly logger;
    constructor(bookModel: Model<BookDocument>, bookReviewModel: Model<BookReviewDocument>, bookCopyModel: Model<BookCopyDocument>, httpService: HttpService, configService: ConfigService, redisEmitter: RedisEmitterService);
    private logActivity;
    private notifyAdmins;
    private validateStorageCapacity;
    create(createBookDto: CreateBookDto, adminId?: string, role?: string): Promise<Book>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    findByBookId(bookId: string): Promise<Book>;
    findCopiesByBookId(bookId: string): Promise<BookCopy[]>;
    findCopiesByTitleId(id: string): Promise<BookCopy[]>;
    update(id: string, updateBookDto: UpdateBookDto, adminId?: string): Promise<Book>;
    updateStatus(id: string, status: string): Promise<Book>;
    updateCopyStatus(copyNumber: string, status: BookStatus, condition?: BookCondition): Promise<BookCopy>;
    updateConditionQuantity(bookId: string, condition: string, change: number): Promise<Book>;
    remove(id: string, adminId?: string): Promise<void>;
    search(query: string): Promise<Book[]>;
    findAllCategories(): Promise<string[]>;
    findByCategory(category: string): Promise<Book[]>;
    findByRack(rackNumber: string): Promise<Book[]>;
    createReview(createReviewDto: CreateBookReviewDto, token: string): Promise<BookReview>;
    findReviewsByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    checkReview(bookId: string, memberId: string): Promise<{
        reviewed: boolean;
    }>;
    findReviewsByBook(bookId: string): Promise<BookReview[]>;
    toggleLike(reviewId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findReviewsByMember(memberId: string): Promise<BookReview[]>;
    updateReview(reviewId: string, userId: string, updateData: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, BookReview, {}, {}> & BookReview & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    deleteReview(reviewId: string, userId: string, role: string): Promise<void>;
    getCollectionStats(): Promise<any>;
    getTopReviews(): Promise<any[]>;
}
