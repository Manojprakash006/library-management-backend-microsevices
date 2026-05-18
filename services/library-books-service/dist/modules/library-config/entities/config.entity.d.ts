import { Document } from 'mongoose';
export type ConfigDocument = Config & Document;
export declare class Config {
    maxRackCapacity: number;
    maxShelfCapacity: number;
    configKey: string;
    overdueFinePerDay: number;
    damagedFinePercent: number;
    lostFinePercent: number;
}
export declare const ConfigSchema: import("mongoose").Schema<Config, import("mongoose").Model<Config, any, any, any, Document<unknown, any, Config, any, {}> & Config & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Config, Document<unknown, {}, import("mongoose").FlatRecord<Config>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Config> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
