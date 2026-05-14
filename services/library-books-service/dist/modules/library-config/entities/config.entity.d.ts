import { Document } from 'mongoose';
export type ConfigDocument = Config & Document;
export declare class Config {
    maxRackCapacity: number;
    maxShelfCapacity: number;
    configKey: string;
}
export declare const ConfigSchema: any;
