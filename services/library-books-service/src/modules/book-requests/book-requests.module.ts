import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookRequestsController } from './controller/book-requests.controller';
import { BookRequestsService } from './service/book-requests.service';
import { BookRequest, BookRequestSchema } from './entities/book-request.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookRequest.name, schema: BookRequestSchema },
    ]),
  ],
  controllers: [BookRequestsController],
  providers: [BookRequestsService],
  exports: [BookRequestsService],
})
export class BookRequestsModule {}
