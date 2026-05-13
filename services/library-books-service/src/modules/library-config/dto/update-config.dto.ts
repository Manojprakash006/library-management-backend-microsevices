import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateConfigDto {
  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(50)
  maxRackCapacity?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  maxShelfCapacity?: number;
}
