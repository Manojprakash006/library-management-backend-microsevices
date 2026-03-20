import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './controller/books.controller';
import { BooksService } from './service/books.service';
import { Book, BookSchema } from './entities/book.entity';
import { BookReview, BookReviewSchema } from './entities/book-review.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: BookReview.name, schema: BookReviewSchema },
    ]),
    HttpModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule { }
