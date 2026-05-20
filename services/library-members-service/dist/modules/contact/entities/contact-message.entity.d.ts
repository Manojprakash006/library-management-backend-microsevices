import { Document } from 'mongoose';
export type ContactMessageDocument = ContactMessage & Document;
export declare class ContactMessage {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    replyMessage: string;
    repliedAt: Date;
}
export declare const ContactMessageSchema: import("mongoose").Schema<ContactMessage, import("mongoose").Model<ContactMessage, any, any, any, Document<unknown, any, ContactMessage, any, {}> & ContactMessage & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ContactMessage, Document<unknown, {}, import("mongoose").FlatRecord<ContactMessage>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ContactMessage> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
