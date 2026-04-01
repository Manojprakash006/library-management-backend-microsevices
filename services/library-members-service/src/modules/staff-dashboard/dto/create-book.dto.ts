import { IsString, IsNumber, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'Book ID', required: false, example: 'B001' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  bookId?: string;

  @ApiProperty({ description: 'ISBN number', required: false, example: '978-3-16-148410-0' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiProperty({ description: 'Book title', required: true, example: 'Data Structures' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @ApiProperty({ description: 'Author name', required: true, example: 'Robert Lafore' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  author: string;

  @ApiProperty({ description: 'Book category', required: true, example: 'Computer Science' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Rack number', required: true, example: 'Rack 01' })
  @IsString()
  rackNumber: string;

  @ApiProperty({ description: 'Shelf number', required: false, example: 'A1' })
  @IsOptional()
  @IsString()
  shelfNumber?: string;

  @ApiProperty({ description: 'Publisher name', required: false, example: 'Pearson' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  publisher?: string;

  @ApiProperty({ description: 'Publish year', required: false, example: 2024 })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear() + 1)
  publishYear?: number;

  @ApiProperty({ description: 'Edition', required: false, example: '2nd' })
  @IsOptional()
  @IsString()
  edition?: string;

  @ApiProperty({ description: 'Language', required: false, example: 'English' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: 'Number of pages', required: false, example: 350 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pages?: number;

  @ApiProperty({ description: 'Price', required: false, example: 499.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ description: 'Book type', required: false, example: 'Issue Book', enum: ['Issue Book', 'Reference Book'] })
  @IsOptional()
  @IsString()
  bookType?: string;

  @ApiProperty({ description: 'Book condition', required: false, example: 'Good', enum: ['New', 'Good', 'Fair', 'Poor'] })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiProperty({ description: 'Book status', required: false, example: 'available', enum: ['available', 'issued', 'reserved', 'maintenance'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Book description', required: false, example: 'Comprehensive guide to data structures' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ description: 'Quantity', required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;
}
