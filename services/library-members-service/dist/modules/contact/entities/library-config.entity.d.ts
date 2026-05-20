import { Document } from 'mongoose';
export type LibraryConfigDocument = LibraryConfig & Document;
export declare enum holidays {
    publicLeave = "Closed on public holidays",
    maintenanceLeave = "Closed for Maintenance",
    localHoliday = "Closed on Local holidays",
    festivalHoliday = "Closed on Festival holidays"
}
export declare class LibraryConfig {
    libraryName: string;
    address: string;
    phone: string;
    referencePhone: string;
    email: string;
    membershipEmail: string;
    weekdaysOpen: string;
    weekdaysClose: string;
    weekendOpen: string;
    weekendClose: string;
    weekdaysLabel: string;
    weekendLabel: string;
    holidaysInfo: string;
    holidayFromDate: Date;
    holidayToDate: Date;
    isHolidayActive: boolean;
    googleMapsEmbed: string;
    privacyPolicy: string;
    termsOfService: string;
}
export declare const LibraryConfigSchema: import("mongoose").Schema<LibraryConfig, import("mongoose").Model<LibraryConfig, any, any, any, Document<unknown, any, LibraryConfig, any, {}> & LibraryConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LibraryConfig, Document<unknown, {}, import("mongoose").FlatRecord<LibraryConfig>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<LibraryConfig> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
