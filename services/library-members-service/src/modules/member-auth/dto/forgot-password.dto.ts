import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Member email address', example: 'member@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token received via email', example: 'abc123xyz' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'New password', example: 'newpassword123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;
}
