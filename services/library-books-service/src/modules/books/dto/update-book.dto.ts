import { IsString, IsNumber, IsOptional, IsEnum, IsUrl, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookType, BookCondition, BookStatus } from '../entities/book.entity';

export class UpdateBookDto {
  @ApiProperty({ description: 'Book title', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @ApiProperty({ description: 'Book author', required: false })
  @IsOptional()
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

  @ApiProperty({ description: 'Book category', required: false })
  @IsOptional()
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

  @ApiProperty({ description: 'Rack number where book is stored', required: false })
  @IsOptional()
  @IsString()
  rackNumber: string;

  @ApiProperty({ description: 'Shelf number', required: false })
  @IsOptional()
  @IsString()
  shelfNumber: string;

  @ApiProperty({ description: 'Type of book', enum: BookType, required: false })
  @IsOptional()
  @IsEnum(BookType)
  bookType: BookType;

  @ApiProperty({ description: 'Book condition', enum: BookCondition, required: false })
  @IsOptional()
  @IsEnum(BookCondition)
  condition: BookCondition;

  @ApiProperty({ description: 'Book status', enum: BookStatus, required: false })
  @IsOptional()
  @IsEnum(BookStatus)
  status: BookStatus;

  @ApiProperty({ description: 'Book description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ description: 'Quantity available', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Cover image URL', required: false })
  @IsOptional()
  @IsUrl()
  coverUrl: string;
}
