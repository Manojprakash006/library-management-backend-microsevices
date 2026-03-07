import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RacksController } from './controller/racks.controller';
import { RacksService } from './service/racks.service';
import { Book, BookSchema } from '../books/entities/book.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [RacksController],
  providers: [RacksService],
  exports: [RacksService],
})
export class RacksModule {}
