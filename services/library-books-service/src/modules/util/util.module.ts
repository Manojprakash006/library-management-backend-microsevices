import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilController } from './controller/util.controller';
import { UtilService } from './service/util.service';
import { Book, BookSchema } from '../books/entities/book.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }])],
  controllers: [UtilController],
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}
