import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestBookAgainDto {
  @ApiProperty({ description: 'Book ID to request again' })
  @IsString()
  bookId: string;
}
