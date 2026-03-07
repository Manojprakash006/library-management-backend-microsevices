import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({ description: 'Rating', minimum: 1, maximum: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ description: 'Review comment', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
