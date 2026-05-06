import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config, ConfigDocument } from '../entities/config.entity';
import { UpdateConfigDto } from '../dto/update-config.dto';

@Injectable()
export class ConfigService implements OnModuleInit {
  constructor(
    @InjectModel(Config.name) private configModel: Model<ConfigDocument>,
  ) {}

  async onModuleInit() {
    // Ensure default config exists
    const config = await this.configModel.findOne({ configKey: 'DEFAULT' }).exec();
    if (!config) {
      const defaultConfig = new this.configModel({
        configKey: 'DEFAULT',
        maxRackCapacity: 50,
        maxShelfCapacity: 10,
      });
      await defaultConfig.save();
    }
  }

  async getConfig(): Promise<Config> {
    return this.configModel.findOne({ configKey: 'DEFAULT' }).exec();
  }

  async updateConfig(updateConfigDto: UpdateConfigDto): Promise<Config> {
    return this.configModel
      .findOneAndUpdate({ configKey: 'DEFAULT' }, updateConfigDto, { new: true })
      .exec();
  }
}
