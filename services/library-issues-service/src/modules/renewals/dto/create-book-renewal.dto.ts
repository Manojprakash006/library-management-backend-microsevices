import { IsString, IsDateString, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RenewalStatus } from '../entities/book-renewal.entity';

export class CreateBookRenewalDto {
  @ApiProperty({ description: 'Unique renewal identifier' })
  @IsString()
  renewalId: string;

  @ApiProperty({ description: 'Issue ID reference' })
  @IsMongoId()
  issueId: string;

  @ApiProperty({ description: 'Member ID reference' })
  @IsMongoId()
  memberId: string;

  @ApiProperty({ description: 'Current due date (ISO string)' })
  @IsDateString()
  currentDueDate: string;

  @ApiProperty({ description: 'New requested due date (ISO string)' })
  @IsDateString()
  newDueDate: string;
}

export class UpdateBookRenewalDto {
  @ApiProperty({ description: 'Renewal status', enum: RenewalStatus, required: false })
  @IsOptional()
  @IsEnum(RenewalStatus)
  status?: RenewalStatus;
}
