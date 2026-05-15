import { IsOptional, IsNumber } from 'class-validator';

export class ApproveRequestDto {

  @IsOptional()
  @IsNumber()
  renewDays?: number;
}