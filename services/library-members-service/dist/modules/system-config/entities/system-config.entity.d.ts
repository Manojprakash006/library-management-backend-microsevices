import { Document } from 'mongoose';
export type SystemConfigDocument = SystemConfig & Document;
export declare class SystemConfig {
    configKey: string;
    shiftStartTime: string;
    shiftEndTime: string;
    gracePeriod: number;
    autoAbsentEnabled: boolean;
}
export declare const SystemConfigSchema: import("mongoose").Schema<SystemConfig, import("mongoose").Model<SystemConfig, any, any, any, Document<unknown, any, SystemConfig, any, {}> & SystemConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SystemConfig, Document<unknown, {}, import("mongoose").FlatRecord<SystemConfig>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<SystemConfig> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
