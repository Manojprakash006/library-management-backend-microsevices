import { Model, Types } from 'mongoose';
import { LibraryVisit, LibraryVisitDocument } from '../entities/library-visit.entity';
import { CheckInDto, CheckOutDto } from '../dto/library-visit.dto';
import { NotificationsService } from '../../notifications/service/notifications.service';
export declare class LibraryVisitsService {
    private libraryVisitModel;
    private readonly notificationsService;
    private readonly logger;
    constructor(libraryVisitModel: Model<LibraryVisitDocument>, notificationsService: NotificationsService);
    private getMemberDetails;
    private getBookTitle;
    checkIn(checkInDto: CheckInDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, LibraryVisitDocument, {}, {}> & LibraryVisit & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    checkOut(checkOutDto: CheckOutDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, LibraryVisitDocument, {}, {}> & LibraryVisit & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getTodaysVisits(): Promise<(import("mongoose").Document<unknown, {}, LibraryVisitDocument, {}, {}> & LibraryVisit & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getActiveVisits(): Promise<(import("mongoose").Document<unknown, {}, LibraryVisitDocument, {}, {}> & LibraryVisit & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getMemberVisitHistory(memberId: string): Promise<(import("mongoose").Document<unknown, {}, LibraryVisitDocument, {}, {}> & LibraryVisit & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createVisitForBookIssue(memberId: string, bookId: string, purpose?: string, timeIn?: Date, timeOut?: Date | null): Promise<import("mongoose").Document<unknown, {}, LibraryVisitDocument, {}, {}> & LibraryVisit & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    recordReturnVisit(memberId: string, bookId: string): Promise<import("mongoose").Document<unknown, {}, LibraryVisitDocument, {}, {}> & LibraryVisit & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getVisitStats(): Promise<number>;
    getVisitsByDate(dateStr?: string): Promise<(import("mongoose").Document<unknown, {}, LibraryVisitDocument, {}, {}> & LibraryVisit & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
