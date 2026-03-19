import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MemberRegisterDto {
  @ApiProperty({ description: 'Member email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Member password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Member name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Member phone Number'})
  @IsString()
  @MinLength(10)
  phone: string;

  @ApiProperty({ description: 'Member Address'})
  @IsString()
  address: string;
}
