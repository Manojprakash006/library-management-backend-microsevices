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
export declare const LibraryVisitSchema: any;
