import { HydratedDocument } from 'mongoose';
export type ShiftDocument = HydratedDocument<Shift>;
export declare class Shift {
    name: string;
    startTime: string;
    endTime: string;
    gracePeriod: number;
    lunchDuration: number;
    teaBreakDuration: number;
    maxBreaks: number;
    isActive: boolean;
}
export declare const ShiftSchema: import("mongoose").Schema<Shift, import("mongoose").Model<Shift, any, any, any, import("mongoose").Document<unknown, any, Shift, any, {}> & Shift & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Shift, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Shift>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Shift> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
