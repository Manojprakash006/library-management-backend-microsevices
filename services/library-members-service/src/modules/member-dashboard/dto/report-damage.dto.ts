import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportDamageDto {
  @ApiProperty({ description: 'Book ID' })
  @IsString()
  bookId: string;

  @ApiProperty({ description: 'Damage description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
