import { Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class ApproveRequestDto {

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  renewDays?: number;
}