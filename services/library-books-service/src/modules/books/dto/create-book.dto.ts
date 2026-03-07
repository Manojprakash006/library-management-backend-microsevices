import { IsString, IsNumber, IsOptional, IsEnum, IsUrl, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookType, BookCondition } from '../entities/book.entity';

export class CreateBookDto {
  @ApiProperty({ description: 'Unique book identifier' })
  @IsString()
  @MinLength(1)
  bookId: string;

  @ApiProperty({ description: 'ISBN number', required: false })
  @IsOptional()
  @IsString()
  isbn: string;

  @ApiProperty({ description: 'Book title' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @ApiProperty({ description: 'Book author' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  author: string;

  @ApiProperty({ description: 'Publisher name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  publisher: string;

  @ApiProperty({ description: 'Year of publication', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear() + 1)
  publishYear: number;

  @ApiProperty({ description: 'Book category' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Edition information', required: false })
  @IsOptional()
  @IsString()
  edition: string;

  @ApiProperty({ description: 'Book language', required: false })
  @IsOptional()
  @IsString()
  language: string;

  @ApiProperty({ description: 'Number of pages', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pages: number;

  @ApiProperty({ description: 'Book price', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Rack number where book is stored' })
  @IsString()
  rackNumber: string;

  @ApiProperty({ description: 'Shelf number', required: false })
  @IsOptional()
  @IsString()
  shelfNumber: string;

  @ApiProperty({ description: 'Type of book', enum: BookType, default: BookType.ISSUE_BOOK })
  @IsOptional()
  @IsEnum(BookType)
  bookType: BookType;

  @ApiProperty({ description: 'Book condition', enum: BookCondition, default: BookCondition.GOOD })
  @IsOptional()
  @IsEnum(BookCondition)
  condition: BookCondition;

  @ApiProperty({ description: 'Book description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ description: 'Quantity available', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Cover image URL', required: false })
  @IsOptional()
  @IsUrl()
  coverUrl: string;
}
