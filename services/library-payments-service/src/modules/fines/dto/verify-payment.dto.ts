import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({ description: 'The original Fine ID from our system' })
  @IsNotEmpty()
  @IsString()
  fineId: string;

  @ApiProperty({ description: 'The Razorpay Order ID returned during creation' })
  @IsNotEmpty()
     @IsString()
  razorpayOrderId: string;       

  @ApiProperty({ description: 'The Razorpay Payment ID from successful payment' })
  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string;

  @ApiProperty({ description: 'The Razorpay signature string for verification' })
  @IsNotEmpty()
  @IsString()
  signature: string;
}
