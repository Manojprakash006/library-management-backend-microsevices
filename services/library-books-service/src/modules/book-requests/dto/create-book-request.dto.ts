import { IsString, IsOptional, IsDate, IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookRequestStatus } from '../entities/book-request.entity';

export class CreateBookRequestDto {
  @ApiProperty({ description: 'Unique request identifier' })
  @IsString()
  requestId: string;

  @ApiProperty({ description: 'Book ID reference' })
  @IsMongoId()
  bookId: string;

  @ApiProperty({ description: 'Member ID reference' })
  @IsMongoId()
  memberId: string;

  @ApiProperty({ description: 'Request date', required: false })
  @IsOptional()
  @IsDate()
  requestDate?: Date;
}

export class UpdateBookRequestDto {
  @ApiProperty({ description: 'Request status', enum: BookRequestStatus })
  @IsEnum(BookRequestStatus)
  status: BookRequestStatus;

  @ApiProperty({ description: 'Currently borrowed count', required: false })
  @IsOptional()
  currentlyBorrowed?: number;

  @ApiProperty({ description: 'Total history count', required: false })
  @IsOptional()
  totalHistory?: number;
}
