import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberBooksController } from './controller/member-books.controller';
import { MemberBooksService } from './service/member-books.service';
import { Book, BookSchema } from '../books/entities/book.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [MemberBooksController],
  providers: [MemberBooksService],
  exports: [MemberBooksService],
})
export class MemberBooksModule {}
