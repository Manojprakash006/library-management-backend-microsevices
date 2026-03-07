import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MemberLoginDto {
  @ApiProperty({ description: 'Member email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Member password' })
  @IsString()
  @MinLength(6)
  password: string;
}
