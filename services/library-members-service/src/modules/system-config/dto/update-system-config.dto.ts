import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSystemConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shiftStartTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shiftEndTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  gracePeriod?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoAbsentEnabled?: boolean;
}
