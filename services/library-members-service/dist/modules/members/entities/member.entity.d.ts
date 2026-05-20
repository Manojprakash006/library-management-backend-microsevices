import { HydratedDocument } from 'mongoose';
export type MemberDocument = HydratedDocument<Member>;
export declare class Member {
    memberId: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    membershipDate: Date;
    isActive: boolean;
    booksHeld: number;
    booksAtHome: number;
    readingInsideLibrary: number;
    totalFines: number;
    hasActiveIssues: boolean;
    reviews: Array<{
        bookId: string;
        rating: number;
        comment: string;
        createdAt: Date;
    }>;
    borrowingHistory: Array<{
        bookId: string;
        issueId: string;
        bookTitle?: string;
        borrowedAt: Date;
        dueDate?: Date;
        returnedAt?: Date;
        status: 'borrowed' | 'returned' | 'overdue';
        fine: number;
    }>;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
}
export declare const MemberSchema: import("mongoose").Schema<Member, import("mongoose").Model<Member, any, any, any, import("mongoose").Document<unknown, any, Member, any, {}> & Member & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Member, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Member>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Member> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
