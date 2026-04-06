import { IsString, IsNumber, IsOptional, IsMongoId, IsBoolean, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus } from '../entities/book-review.entity';
import { IsEnum } from 'class-validator';

export class CreateBookReviewDto {
  @ApiProperty({ description: 'Book ID' })
  @IsString()
  bookId: string;

  @ApiProperty({ description: 'Member ID' })
  @IsString()
  memberId: string;

  @ApiProperty({ description: 'Member Name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  memberName: string;

  @ApiProperty({ description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Review title' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  reviewTitle: string;

  @ApiProperty({ description: 'Review text' })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  review: string;

  @ApiProperty({ description: 'Whether the book is recommended', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  recommended: boolean;

  @ApiProperty({ description: 'Review status', enum: ReviewStatus, default: ReviewStatus.PUBLISHED, required: false })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}
