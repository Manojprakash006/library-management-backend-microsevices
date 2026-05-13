import { IsString, IsMongoId, IsOptional, IsDateString, IsNumber, Min, MinLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookRequestDto {

  @ApiProperty({ description: 'Book ID' })
  @IsMongoId()
  bookId: string;

  @ApiProperty({ description: 'Member ID' })
  @IsMongoId()
  memberId: string;

  @ApiProperty({ description: 'Request Type'})
  @IsString()
  @IsIn(['Taking Home', 'Reading Inside Library'], {
    message: 'Please select a valid request type',
  })
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
