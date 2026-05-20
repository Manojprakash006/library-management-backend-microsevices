import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { SystemConfig, SystemConfigDocument } from '../entities/system-config.entity';
import { UpdateSystemConfigDto } from '../dto/update-system-config.dto';
export declare class SystemConfigService implements OnModuleInit {
    private configModel;
    constructor(configModel: Model<SystemConfigDocument>);
    onModuleInit(): Promise<void>;
    getConfig(): Promise<import("mongoose").Document<unknown, {}, SystemConfigDocument, {}, {}> & SystemConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateConfig(dto: UpdateSystemConfigDto): Promise<import("mongoose").Document<unknown, {}, SystemConfigDocument, {}, {}> & SystemConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
