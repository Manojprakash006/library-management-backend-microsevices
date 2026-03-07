import { Controller, Get, Post, Put, Delete, Body, Param, Version, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StaffService } from '../service/staff.service';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { StaffLoginDto } from '../dto/staff-login.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Version('1')
  @Post('login')
  @ApiOperation({ summary: 'Staff login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async staffLogin(@Body() loginDto: StaffLoginDto) {
    const result = await this.staffService.login(loginDto);
    return { message: 'Login successful', data: result };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new staff' })
  @ApiResponse({ status: 201, description: 'Staff created successfully' })
  async createStaff(@Body() createDto: CreateStaffDto) {
    const result = await this.staffService.create(createDto);
    return { message: 'Staff created successfully', data: result };
  }

  @Version('1')
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all staff' })
  @ApiResponse({ status: 200, description: 'Staff retrieved successfully' })
  async getAllStaff() {
    const result = await this.staffService.findAll();
    return { message: 'Staff retrieved successfully', data: result, count: result.length };
  }

  @Version('1')
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

  @Version('1')
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update staff' })
  @ApiResponse({ status: 200, description: 'Staff updated successfully' })
  async updateStaff(@Param('id') id: string, @Body() updateDto: UpdateStaffDto) {
    const result = await this.staffService.update(id, updateDto);
    return { message: 'Staff updated successfully', data: result };
  }

  @Version('1')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete staff' })
  @ApiResponse({ status: 200, description: 'Staff deleted successfully' })
  async deleteStaff(@Param('id') id: string) {
    await this.staffService.delete(id);
    return { message: 'Staff deleted successfully' };
  }
}
