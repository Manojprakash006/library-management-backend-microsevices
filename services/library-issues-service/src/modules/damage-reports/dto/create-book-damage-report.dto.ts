import { IsString, IsNumber, IsEnum, IsMongoId, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DamageReportReason, DamageReportStatus } from '../entities/book-damage-report.entity';

export class CreateBookDamageReportDto {
  @ApiProperty({ description: 'Unique report identifier' })
  @IsString()
  reportId: string;

  @ApiProperty({ description: 'Issue ID reference' })
  @IsMongoId()
  issueId: string;

  @ApiProperty({ description: 'Book ID reference' })
  @IsMongoId()
  bookId: string;

  @ApiProperty({ description: 'Member ID reference' })
  @IsMongoId()
  memberId: string;

  @ApiProperty({ description: 'Reason for report', enum: DamageReportReason })
  @IsEnum(DamageReportReason)
  reason: DamageReportReason;

  @ApiProperty({ description: 'Book amount', minimum: 0 })
  @IsNumber()
  @Min(0)
  bookAmount: number;

  @ApiProperty({ description: 'Fine amount', minimum: 0 })
  @IsNumber()
  @Min(0)
  fineAmount: number;

  @ApiProperty({ description: 'Total amount', minimum: 0 })
  @IsNumber()
  @Min(0)
  totalAmount: number;
}

export class UpdateBookDamageReportDto {
  @ApiProperty({ description: 'Report status', enum: DamageReportStatus, required: false })
  @IsOptional()
  @IsEnum(DamageReportStatus)
  status?: DamageReportStatus;
}
