import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../service/admin.service';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('profile')
  @Roles('admin')
  @ApiOperation({ summary: 'Get current admin profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Req() req): Promise<{ message: string; data: any }> {
    const adminId = req.user.id;
    return this.adminService.getProfile(adminId);
  }

  @Put('profile')
  @Roles('admin')
  @ApiOperation({ summary: 'Update current admin profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Req() req, @Body() updateAdminDto: UpdateAdminDto): Promise<{ message: string; data: any }> {
    const adminId = req.user.id;
    return this.adminService.updateProfile(adminId, updateAdminDto);
  }
}
