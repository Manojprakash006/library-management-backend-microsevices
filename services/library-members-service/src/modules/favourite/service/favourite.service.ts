import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Favourite, FavouriteDocument } from '../entities/favourite.entity';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FavouriteService {

  constructor( @InjectModel(Favourite.name) private favouriteModel: Model<FavouriteDocument>,
    private httpService: HttpService ) {}

  async toggleFavourite(userId: string, bookId: string) {
    const existing = await this.favouriteModel.findOne({
      userId: new Types.ObjectId(userId),
      bookId: new Types.ObjectId(bookId),
    });

    if (existing) {
      await this.favouriteModel.deleteOne({ _id: existing._id });
      return { status: 'removed', bookId };
    }

    await this.favouriteModel.create({
      userId: new Types.ObjectId(userId),
      bookId: new Types.ObjectId(bookId),
    });

    return { status: 'added', bookId };
  }

  async getFavourites(userId: string) {
    try {
      const favourites = await this.favouriteModel.find({ userId: new Types.ObjectId(userId) });

      const booksServiceUrl = 'http://library-api-gateway:3000/library/books';

      const enrichedFavourites = await Promise.all(
        favourites.map(async (fav) => {
          try {
            const response = await firstValueFrom(
              this.httpService.get(`${booksServiceUrl}/books/${fav.bookId}`) );

            return { ...fav.toObject(), book: response.data?.data };
          } catch (err) {
            console.log("BOOK FETCH FAILED:", err.message);
            return { ...fav.toObject(), book: null };
          }
        })
      );

      return enrichedFavourites;

    } catch (error) {
      console.log('FAILED TO FETCH FAVOURITES:', error.message);
      return [];
    }
  }
}