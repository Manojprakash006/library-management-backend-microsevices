import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemConfig, SystemConfigDocument } from '../entities/system-config.entity';
import { UpdateSystemConfigDto } from '../dto/update-system-config.dto';

@Injectable()
export class SystemConfigService implements OnModuleInit {
  constructor(
    @InjectModel(SystemConfig.name) private configModel: Model<SystemConfigDocument>,
  ) {}

  async onModuleInit() {
    const config = await this.configModel.findOne({ configKey: 'DEFAULT' });
    if (!config) {
      await this.configModel.create({ configKey: 'DEFAULT' });
    }
  }

  async getConfig() {
    return await this.configModel.findOne({ configKey: 'DEFAULT' });
  }

  async updateConfig(dto: UpdateSystemConfigDto) {
    return await this.configModel.findOneAndUpdate(
      { configKey: 'DEFAULT' },
      { $set: dto },
      { new: true, upsert: true },
    );
  }
}
