import { IsString, IsMongoId, IsOptional, IsDateString, IsNumber, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookRequestDto {
  @ApiProperty({ description: 'Unique request identifier (auto-generated if not provided)', required: false })
  @IsOptional()
  @IsString()
  requestId: string;

  @ApiProperty({ description: 'Book ID' })
  @IsMongoId()
  bookId: string;

  @ApiProperty({ description: 'Member ID' })
  @IsMongoId()
  memberId: string;

  @ApiProperty({ description: 'Request Type'})
  @IsString()
  @MinLength(4)
  requestType: string;

  @ApiProperty({ description: 'Request date', required: false })
  @IsOptional()
  @IsDateString()
  requestDate: Date;

  @ApiProperty({ description: 'Currently borrowed count', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentlyBorrowed: number;

  @ApiProperty({ description: 'Total history count', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalHistory: number;
}
