import { Controller, Post, Body, Version, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { Public } from "../../../auth/guards/public.decorator";
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Post('login')
   @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<{ token: string; user: any }> {
    return this.authService.login(loginDto);
  }

   @Post('register')
   @Public()
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<{ token: string; user: any }> {
    return this.authService.register(registerDto);
  }

   @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 501, description: 'Not implemented' })
  async refreshToken(): Promise<{ message: string }> {
    return this.authService.refreshToken();
  }

   @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Req() req: any): Promise<{ message: string }> {
    const userId = req.user?.id || req.user?.userId;
    const role = req.user?.role;
    return this.authService.logout(userId, role);
  }
}
