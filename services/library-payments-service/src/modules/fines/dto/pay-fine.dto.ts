import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/fine.entity';

export class PayFineDto {
  @ApiProperty({ enum: PaymentMethod, description: 'The method used for payment' })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ description: 'Reference ID from external payment system' })
  @IsOptional()
  @IsString()
  referenceId?: string;
}
