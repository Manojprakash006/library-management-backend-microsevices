import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ReportsController } from './controller/reports.controller';
import { ReportsService } from './service/reports.service';
import { Book, BookSchema } from '../books/entities/book.entity';
import { BookReview, BookReviewSchema } from '../books/entities/book-review.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: BookReview.name, schema: BookReviewSchema },
    ]),
    HttpModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
