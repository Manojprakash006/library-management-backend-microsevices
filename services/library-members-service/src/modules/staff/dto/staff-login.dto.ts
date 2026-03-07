import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StaffLoginDto {
  @ApiProperty({ description: 'Staff email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Staff password' })
  @IsString()
  @MinLength(6)
  password: string;
}
