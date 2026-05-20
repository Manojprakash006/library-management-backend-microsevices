import { LibraryVisitsService } from '../service/library-visits.service';
import { CheckInDto, CheckOutDto } from '../dto/library-visit.dto';
export declare class LibraryVisitsController {
    private readonly libraryVisitsService;
    constructor(libraryVisitsService: LibraryVisitsService);
    getVisitStats(): Promise<{
        message: string;
        count: number;
    }>;
    autoRecordVisit(data: {
        memberId: string;
        bookId: string;
        purpose: string;
        timeIn: string;
        timeOut?: string;
        isAutoRecorded?: boolean;
    }): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../entities/library-visit.entity").LibraryVisitDocument, {}, {}> & import("../entities/library-visit.entity").LibraryVisit & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    recordReturn(data: {
        memberId: string;
        bookId: string;
    }): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../entities/library-visit.entity").LibraryVisitDocument, {}, {}> & import("../entities/library-visit.entity").LibraryVisit & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    checkIn(checkInDto: CheckInDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../entities/library-visit.entity").LibraryVisitDocument, {}, {}> & import("../entities/library-visit.entity").LibraryVisit & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    checkOut(checkOutDto: CheckOutDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../entities/library-visit.entity").LibraryVisitDocument, {}, {}> & import("../entities/library-visit.entity").LibraryVisit & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getTodaysVisits(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../entities/library-visit.entity").LibraryVisitDocument, {}, {}> & import("../entities/library-visit.entity").LibraryVisit & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getActiveVisits(): Promise<{
        message: string;
        count: number;
        data: (import("mongoose").Document<unknown, {}, import("../entities/library-visit.entity").LibraryVisitDocument, {}, {}> & import("../entities/library-visit.entity").LibraryVisit & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getMyHistory(req: any): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../entities/library-visit.entity").LibraryVisitDocument, {}, {}> & import("../entities/library-visit.entity").LibraryVisit & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getVisitsByDate(req: any): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../entities/library-visit.entity").LibraryVisitDocument, {}, {}> & import("../entities/library-visit.entity").LibraryVisit & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
