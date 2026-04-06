import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../config/config.module';
import { Fine, FineSchema } from './entities/fine.entity';
import { FinesService } from './service/fines.service';
import { FinesController } from './controller/fines.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fine.name, schema: FineSchema }]),
    ConfigModule,
  ],
  controllers: [FinesController],
  providers: [FinesService],
  exports: [FinesService],
})
export class FinesModule {}
