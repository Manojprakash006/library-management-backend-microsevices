import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User phone Number'})
  @IsString()
  @MinLength(10)
  phone: string;

  @ApiProperty({ description: 'User Address'})
  @IsString()
  address: string;

  @ApiProperty({ description: 'User role', enum: ['admin', 'staff', 'member'], required: false })
  @IsOptional()
  @IsEnum(['admin', 'staff', 'member'])
  role?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ description: 'User email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
