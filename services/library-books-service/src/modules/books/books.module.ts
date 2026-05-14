import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './controller/books.controller';
import { BooksService } from './service/books.service';
import { Book, BookSchema } from './entities/book.entity';
import { BookReview, BookReviewSchema } from './entities/book-review.entity';
import { BookCopy, BookCopySchema } from './entities/book-copy.entity';
import { HttpModule } from '@nestjs/axios';
import { LibraryConfigModule } from '../library-config/library-config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: BookReview.name, schema: BookReviewSchema },
      { name: BookCopy.name, schema: BookCopySchema },
    ]),
    HttpModule,
    LibraryConfigModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule { }
