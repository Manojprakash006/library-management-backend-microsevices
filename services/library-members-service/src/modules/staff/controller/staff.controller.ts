import { Controller, Get, Post, Put, Delete, Body, Param, Query, Version, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StaffService } from '../service/staff.service';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { StaffLoginDto } from '../dto/staff-login.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Public } from '../../../auth/guards/public.decorator';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) { }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Staff login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async staffLogin(@Body() loginDto: StaffLoginDto) {
    const result = await this.staffService.login(loginDto);
    return { message: 'Login successful', data: result };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Staff logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async staffLogout(@Req() req: any) {
    const staffId = req.user?.userId || req.user?.id;
    const result = await this.staffService.logout(staffId);
    return { message: 'Logout successful', data: result };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new staff' })
  @ApiResponse({ status: 201, description: 'Staff created successfully' })
  async createStaff(@Body() createDto: CreateStaffDto, @Req() req: any) {
    const adminId = req.user?.id;
    const result = await this.staffService.create(createDto, adminId);
    return { message: 'Staff created successfully', data: result };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff statistics' })
  @ApiResponse({ status: 200, description: 'Staff statistics retrieved successfully' })
  async getStaffStats() {
    const stats = await this.staffService.getStats();
    return { message: 'Staff statistics retrieved successfully', data: stats };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all staff' })
  @ApiResponse({ status: 200, description: 'Staff retrieved successfully' })
  async getAllStaff(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    
    const result = await this.staffService.findAll(pageNum, limitNum);
    return { 
      message: 'Staff retrieved successfully', 
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff by ID' })
  @ApiResponse({ status: 200, description: 'Staff retrieved successfully' })
  async getStaffById(@Param('id') id: string) {
    const result = await this.staffService.findById(id);
    return { message: 'Staff retrieved successfully', data: result };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update staff' })
  @ApiResponse({ status: 200, description: 'Staff updated successfully' })
  async updateStaff(@Param('id') id: string, @Body() updateDto: UpdateStaffDto, @Req() req: any) {
    const adminId = req.user?.id;
    const result = await this.staffService.update(id, updateDto, adminId);
    return { message: 'Staff updated successfully', data: result };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete staff' })
  @ApiResponse({ status: 200, description: 'Staff deleted successfully' })
  async deleteStaff(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user?.id;
    await this.staffService.delete(id, adminId);
    return { message: 'Staff deleted successfully' };
  }

  @Roles('admin')
  @Get('reports/staff-performance')
  @ApiOperation({ summary: 'Get staff performance report' })
  async getStaffPerformanceReport() {
    return this.staffService.getStaffPerformanceReport();
  }
}

// function diskStorage(arg0: { destination: string; filename: (req: any, file: any, callback: any) => void; }): any {
//   throw new Error('Function not implemented.');
// }

