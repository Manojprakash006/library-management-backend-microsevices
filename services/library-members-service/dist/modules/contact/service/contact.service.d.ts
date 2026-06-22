import { Model } from 'mongoose';
import { ContactMessage, ContactMessageDocument } from '../entities/contact-message.entity';
import { LibraryConfig, LibraryConfigDocument } from '../entities/library-config.entity';
import { CreateContactMessageDto } from '../dto/contact-message.dto';
import { NotificationsService } from '../../notifications/service/notifications.service';
import { EmailService } from '../../notifications/service/email.service';
import { NotificationsGateway } from '../../notifications/gateway/notifications.gateway';
export declare class ContactService {
    private contactMessageModel;
    private libraryConfigModel;
    private readonly notificationsService;
    private readonly emailService;
    private readonly notificationsGateway;
    private readonly logger;
    constructor(contactMessageModel: Model<ContactMessageDocument>, libraryConfigModel: Model<LibraryConfigDocument>, notificationsService: NotificationsService, emailService: EmailService, notificationsGateway: NotificationsGateway);
    sendReply(id: string, replyMessage: string): Promise<import("mongoose").Document<unknown, {}, ContactMessageDocument, {}, {}> & ContactMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createMessage(createDto: CreateContactMessageDto): Promise<import("mongoose").Document<unknown, {}, ContactMessageDocument, {}, {}> & ContactMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllMessages(): Promise<(import("mongoose").Document<unknown, {}, ContactMessageDocument, {}, {}> & ContactMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateMessageStatus(id: string, status: string): Promise<import("mongoose").Document<unknown, {}, ContactMessageDocument, {}, {}> & ContactMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getLibraryConfig(): Promise<import("mongoose").Document<unknown, {}, LibraryConfigDocument, {}, {}> & LibraryConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateLibraryConfig(updateData: Partial<LibraryConfig>): Promise<import("mongoose").Document<unknown, {}, LibraryConfigDocument, {}, {}> & LibraryConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
