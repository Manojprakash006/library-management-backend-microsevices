import { IsString, IsOptional, IsDate, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityLogDto {
  @ApiProperty({ description: 'Action performed' })
  @IsString()
  action: string;

  @ApiProperty({ description: 'Book ID reference', required: false })
  @IsOptional()
  @IsMongoId()
  bookId?: string;

  @ApiProperty({ description: 'Member ID reference', required: false })
  @IsOptional()
  @IsMongoId()
  memberId?: string;

  @ApiProperty({ description: 'User ID reference', required: false })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({ description: 'Description of the activity' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Person who performed the action' })
  @IsString()
  performedBy: string;
}
