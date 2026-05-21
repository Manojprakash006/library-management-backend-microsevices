import { MemberBooksService } from '../service/member-books.service';
import { RequestBookDto } from '../dto/request-book.dto';
export declare class MemberBooksController {
    private readonly memberBooksService;
    constructor(memberBooksService: MemberBooksService);
    getAllBooks(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../books/entities/book.entity").Book, {}, {}> & import("../../books/entities/book.entity").Book & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("../../books/entities/book.entity").Book, {}, {}> & import("../../books/entities/book.entity").Book & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        count: number;
    }>;
    getBookById(bookId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../books/entities/book.entity").Book, {}, {}> & import("../../books/entities/book.entity").Book & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("../../books/entities/book.entity").Book, {}, {}> & import("../../books/entities/book.entity").Book & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    requestBook(requestDto: RequestBookDto): Promise<{
        message: string;
        data: {
            message: string;
            bookId: string;
            memberId: string;
            status: string;
        };
    }>;
}
