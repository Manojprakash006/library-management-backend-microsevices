import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { RacksController } from './controller/racks.controller';
import { RacksService } from './service/racks.service';
import { Book, BookSchema } from '../books/entities/book.entity';
import { LibraryConfigModule } from '../library-config/library-config.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    HttpModule,
    LibraryConfigModule,
  ],
  controllers: [RacksController],
  providers: [RacksService],
  exports: [RacksService],
})
export class RacksModule {}
