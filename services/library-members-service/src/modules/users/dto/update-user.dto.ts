import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'User email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'User phone', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
