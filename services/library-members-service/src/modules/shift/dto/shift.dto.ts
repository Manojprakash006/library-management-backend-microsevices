import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShiftDto {
  @ApiProperty({ example: 'General' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '09:00 AM' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '06:00 PM' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @IsOptional()
  gracePeriod?: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  @IsOptional()
  lunchDuration?: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @IsOptional()
  teaBreakDuration?: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsOptional()
  maxBreaks?: number;
}

export class UpdateShiftDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsNumber()
  @IsOptional()
  gracePeriod?: number;

  @IsNumber()
  @IsOptional()
  lunchDuration?: number;

  @IsNumber()
  @IsOptional()
  teaBreakDuration?: number;

  @IsNumber()
  @IsOptional()
  maxBreaks?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
