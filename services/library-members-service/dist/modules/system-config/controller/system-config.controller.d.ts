import { SystemConfigService } from '../service/system-config.service';
import { UpdateSystemConfigDto } from '../dto/update-system-config.dto';
export declare class SystemConfigController {
    private readonly configService;
    constructor(configService: SystemConfigService);
    getConfig(): Promise<import("mongoose").Document<unknown, {}, import("../entities/system-config.entity").SystemConfigDocument, {}, {}> & import("../entities/system-config.entity").SystemConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateConfig(dto: UpdateSystemConfigDto): Promise<import("mongoose").Document<unknown, {}, import("../entities/system-config.entity").SystemConfigDocument, {}, {}> & import("../entities/system-config.entity").SystemConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
