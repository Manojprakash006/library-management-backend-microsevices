import { IsMongoId, IsEnum, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IssueType } from '../entities/issue-book.entity';

export class CreateIssueDto {
  @ApiProperty({ description: 'Book ID' })
  @IsMongoId()
  bookId: string;

  @ApiProperty({ description: 'Member ID' })
  @IsMongoId()
  memberId: string;

  @ApiProperty({ description: 'Issue type', enum: IssueType })
  @IsEnum(IssueType)
  issueType: IssueType;

  @ApiProperty({ description: 'Number of days to issue', minimum: 1 })
  @IsNumber()
  @Min(1)
  numberOfDays: number;

  @ApiProperty({ description: 'Issue date', required: false })
  @IsOptional()
  @IsDateString()
  issueDate: Date;
}
