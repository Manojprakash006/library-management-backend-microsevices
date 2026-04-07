import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class ToggleFavouriteDto {

  @ApiProperty({ description: 'User ID' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'Book ID' })
  @IsMongoId()
  bookId: string;
}