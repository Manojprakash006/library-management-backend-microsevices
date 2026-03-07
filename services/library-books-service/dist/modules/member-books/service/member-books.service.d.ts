import { Model } from 'mongoose';
import { Book, BookDocument } from '../../books/entities/book.entity';
import { RequestBookDto } from '../dto/request-book.dto';
export declare class MemberBooksService {
    private bookModel;
    constructor(bookModel: Model<BookDocument>);
    getAllBooks(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Book, {}, {}> & Book & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Book, {}, {}> & Book & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getBookById(bookId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Book, {}, {}> & Book & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Book, {}, {}> & Book & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    requestBook(requestDto: RequestBookDto): Promise<{
        message: string;
        bookId: string;
        memberId: string;
        status: string;
    }>;
}
