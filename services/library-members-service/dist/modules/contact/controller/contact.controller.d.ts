import { ContactService } from '../service/contact.service';
import { CreateContactMessageDto } from '../dto/contact-message.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    sendMessage(createDto: CreateContactMessageDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../entities/contact-message.entity").ContactMessageDocument, {}, {}> & import("../entities/contact-message.entity").ContactMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getMessages(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../entities/contact-message.entity").ContactMessageDocument, {}, {}> & import("../entities/contact-message.entity").ContactMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    updateStatus(id: string, status: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../entities/contact-message.entity").ContactMessageDocument, {}, {}> & import("../entities/contact-message.entity").ContactMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    sendReply(id: string, replyMessage: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../entities/contact-message.entity").ContactMessageDocument, {}, {}> & import("../entities/contact-message.entity").ContactMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getLibraryInfo(): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../entities/library-config.entity").LibraryConfigDocument, {}, {}> & import("../entities/library-config.entity").LibraryConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    updateLibraryInfo(updateData: any): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../entities/library-config.entity").LibraryConfigDocument, {}, {}> & import("../entities/library-config.entity").LibraryConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
