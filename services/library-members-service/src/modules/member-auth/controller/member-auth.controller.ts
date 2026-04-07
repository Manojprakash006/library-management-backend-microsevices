import { Controller, Post, Get, Body, Version, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MemberAuthService } from '../service/member-auth.service';
import { MemberRegisterDto } from '../dto/member-register.dto';
import { MemberLoginDto } from '../dto/member-login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/forgot-password.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Public } from '../../../auth/guards/public.decorator';

@ApiTags('Member Auth')
@Controller('member-auth')
export class MemberAuthController {
  constructor(private readonly memberAuthService: MemberAuthService) {}

   @Post('register')
   @Public()
  @ApiOperation({ summary: 'Register a new member' })
  @ApiResponse({ status: 201, description: 'Member registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async register(@Body() registerDto: MemberRegisterDto) {
    const result = await this.memberAuthService.register(registerDto);
    console.log("register DTO :", registerDto);
    console.log("post register :", result);
    return { message: 'Member registered successfully', data: result };
  }

   @Post('login')
   @Public()
  @ApiOperation({ summary: 'Member login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: MemberLoginDto) {
    const result = await this.memberAuthService.login(loginDto);
    return { message: 'Login successful', data: result };
  }

   @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get member profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Request() req) {
    const result = await this.memberAuthService.getProfile(req.user.id);
    return { message: 'Profile retrieved successfully', data: result };
  }

   @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset instructions sent' })
  @ApiResponse({ status: 404, description: 'Email not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.memberAuthService.forgotPassword(forgotPasswordDto.email);
    return { message: 'Password reset instructions sent to email', data: result };
  }

   @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token or password' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.memberAuthService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return { message: 'Password reset successfully', data: result };
  }
}
