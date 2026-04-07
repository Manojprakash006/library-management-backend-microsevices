import { Module } from '@nestjs/common';
import { FavouriteService } from './service/favourite.service';
import { FavouriteController } from './controller/favourite.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favourite, FavouriteSchema } from './entities/favourite.entity';
import { Book, BookSchema } from './shared/book.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favourite.name, schema: FavouriteSchema },
      { name: Book.name, schema: BookSchema },
    ]),
    HttpModule,
  ],
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule {}