import { IsString, IsNumber, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFineDto {
  @ApiProperty({ example: '69c6045569c08d3794d014f9' })
  @IsMongoId()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({ example: '69c12fd4d5c26ff63522def8' })
  @IsMongoId()
  @IsNotEmpty()
  issueId: string;

  @ApiProperty({ example: '69ce751ca3666448d45dae9c', required: false })
  @IsMongoId()
  @IsOptional()
  bookId?: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'Overdue by 1 days' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
