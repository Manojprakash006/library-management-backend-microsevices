import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigController } from './controller/config.controller';
import { ConfigService } from './service/config.service';
import { Config, ConfigSchema } from './entities/config.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class LibraryConfigModule {}
