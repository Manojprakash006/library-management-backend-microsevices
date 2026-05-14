import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Config, ConfigDocument } from '../entities/config.entity';
import { UpdateConfigDto } from '../dto/update-config.dto';
export declare class ConfigService implements OnModuleInit {
    private configModel;
    constructor(configModel: Model<ConfigDocument>);
    onModuleInit(): Promise<void>;
    getConfig(): Promise<Config>;
    updateConfig(updateConfigDto: UpdateConfigDto): Promise<Config>;
}
