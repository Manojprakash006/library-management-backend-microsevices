import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsController } from './controller/requests.controller';
import { RequestsService } from './service/requests.service';
import { BookRequest, BookRequestSchema } from './entities/book-request.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: BookRequest.name, schema: BookRequestSchema }])],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
