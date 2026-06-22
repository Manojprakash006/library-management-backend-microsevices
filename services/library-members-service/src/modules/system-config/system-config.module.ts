import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemConfig, SystemConfigSchema } from './entities/system-config.entity';
import { SystemConfigService } from './service/system-config.service';
import { SystemConfigController } from './controller/system-config.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SystemConfig.name, schema: SystemConfigSchema }]),
  ],
  providers: [SystemConfigService],
  controllers: [SystemConfigController],
  exports: [SystemConfigService],
})
export class SystemConfigModule {}
