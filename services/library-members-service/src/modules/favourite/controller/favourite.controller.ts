import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FavouriteService } from '../service/favourite.service';
import { ToggleFavouriteDto } from '../dto/favourite.dto';

@Controller('favourites')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Post('toggle')
  toggle(@Body() dto: ToggleFavouriteDto) {
    return this.favouriteService.toggleFavourite(dto.userId, dto.bookId);
  }

  @Get(':userId')
  getAll(@Param('userId') userId: string) {
    return this.favouriteService.getFavourites(userId);
  }
}