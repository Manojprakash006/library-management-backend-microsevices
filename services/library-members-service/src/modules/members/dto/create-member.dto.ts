import { IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ description: 'Unique member identifier (auto-generated if not provided)', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  memberId?: string;

  @ApiProperty({ description: 'Full name of the member' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number', minLength: 10, maxLength: 20, required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phoneNumber?: string;

  @ApiProperty({ description: 'Address', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiProperty({ description: 'Password', minLength: 6, maxLength: 100 })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
