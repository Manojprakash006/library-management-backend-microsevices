import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RenewBookDto {
  @ApiProperty({ description: 'Issue ID' })
  @IsString()
  issueId: string;

  @ApiProperty({ description: 'Reason for renewal', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
