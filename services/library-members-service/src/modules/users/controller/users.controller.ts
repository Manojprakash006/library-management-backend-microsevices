import { Controller, Get, Put, Body, Version, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Version('1')
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Request() req: any) {
    const result = await this.usersService.getProfile(req.user.userId);
    return { message: 'Profile retrieved successfully', data: result };
  }

  @Version('1')
  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Request() req: any, @Body() updateDto: UpdateUserDto) {
    const result = await this.usersService.updateProfile(req.user.userId, updateDto);
    return { message: 'Profile updated successfully', data: result };
  }

  @Version('1')
  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async listUsers() {
    const result = await this.usersService.listUsers();
    return { message: 'Users retrieved successfully', data: result, count: result.length };
  }
}
