import { IsString, IsMongoId, IsOptional, IsDateString, IsNumber, Min, MinLength, IsIn, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestType } from '../entities/book-request.entity';

export class CreateBookRequestDto {

  @ApiProperty({ description: 'Book ID' })
  @IsMongoId()
  bookId: string;

  @ApiProperty({ description: 'Member ID' })
  @IsMongoId()
  memberId: string;

  @IsOptional()
  @IsString()
  issueId?: string;

  @ApiProperty({ description: 'Request Type'})
  @IsEnum(RequestType)
  // @IsIn(['Taking Home', 'Reading Inside Library'], {
  //   message: 'Please select a valid request type',
  // })
  requestType: RequestType;

  @IsOptional()
  @IsNumber()
  renewDays?: number;

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
