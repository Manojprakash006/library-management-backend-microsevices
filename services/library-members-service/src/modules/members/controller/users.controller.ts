import { Controller, Get, Put, Body, Version, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { UpdateUserDto } from '../../auth/dto/auth.dto';
import { User } from '../../auth/entities/user.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

   @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [User] })
  async listUsers(): Promise<{ message: string; data: User[]; count: number }> {
    const users = await this.usersService.findAll();
    return { message: 'Users retrieved successfully', data: users, count: users.length };
  }

   @Get('me')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Req() req): Promise<{ message: string; data: any }> {
    const userId = req.user.id;
    return this.usersService.getProfile(userId);
  }

   @Put('me')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<{ message: string; data: any }> {
    const userId = req.user.id;
    return this.usersService.updateProfile(userId, updateUserDto);
  }
}
