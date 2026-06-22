import { Document, Types } from 'mongoose';
export type LibraryVisitDocument = LibraryVisit & Document;
export declare class LibraryVisit {
    memberId: Types.ObjectId;
    timeIn: Date;
    timeOut: Date;
    purpose: string;
    bookIds: string[];
    notes: string;
    isActive: boolean;
}
export declare const LibraryVisitSchema: import("mongoose").Schema<LibraryVisit, import("mongoose").Model<LibraryVisit, any, any, any, Document<unknown, any, LibraryVisit, any, {}> & LibraryVisit & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LibraryVisit, Document<unknown, {}, import("mongoose").FlatRecord<LibraryVisit>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<LibraryVisit> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
