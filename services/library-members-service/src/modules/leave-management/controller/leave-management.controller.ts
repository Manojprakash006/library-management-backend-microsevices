import { Controller, Post, Get, Body, Param, Patch, Query } from '@nestjs/common';
import { LeaveManagementService } from '../service/leave-management.service';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from '../dto/leave-request.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Leave Management')
@Controller('leave-management')
export class LeaveManagementController {
  constructor(private readonly leaveService: LeaveManagementService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Apply for leave' })
  async applyLeave(@Body() dto: CreateLeaveRequestDto) {
    return await this.leaveService.applyLeave(dto);
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Update leave request status (Admin only)' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateLeaveStatusDto) {
    return await this.leaveService.updateStatus(id, dto);
  }

  @Get('staff/:staffId')
  @ApiOperation({ summary: 'Get leave history for a staff' })
  async getStaffLeaves(@Param('staffId') staffId: string) {
    return await this.leaveService.getStaffLeaves(staffId);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get all leave requests' })
  async getAllRequests(@Query('status') status?: string) {
    return await this.leaveService.getAllRequests(status);
  }
}
