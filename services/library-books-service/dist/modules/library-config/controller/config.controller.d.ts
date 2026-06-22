import { ConfigService } from '../service/config.service';
import { UpdateConfigDto } from '../dto/update-config.dto';
export declare class ConfigController {
    private readonly configService;
    constructor(configService: ConfigService);
    getConfig(): Promise<{
        message: string;
        data: import("../entities/config.entity").Config;
    }>;
    updateConfig(updateConfigDto: UpdateConfigDto): Promise<{
        message: string;
        data: import("../entities/config.entity").Config;
    }>;
}
