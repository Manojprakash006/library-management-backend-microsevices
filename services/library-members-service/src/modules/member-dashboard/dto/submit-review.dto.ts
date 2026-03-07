import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitReviewDto {
  @ApiProperty({ description: 'Book ID' })
  @IsString()
  bookId: string;

  @ApiProperty({ description: 'Rating', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Review comment', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
