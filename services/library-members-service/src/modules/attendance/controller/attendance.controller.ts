import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from '../service/attendance.service';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  @ApiOperation({ summary: 'Mark attendance (Admin only)' })
  async markAttendance(@Body() dto: CreateAttendanceDto) {
    return await this.attendanceService.markAttendance(dto);
  }

  @Post('check-in/:staffId')
  @ApiOperation({ summary: 'Staff check-in' })
  async checkIn(@Param('staffId') staffId: string) {
    return await this.attendanceService.checkIn(staffId);
  }

  @Post('check-out/:staffId')
  @ApiOperation({ summary: 'Staff check-out' })
  async checkOut(@Param('staffId') staffId: string) {
    return await this.attendanceService.checkOut(staffId);
  }

  @Post('break-start/:staffId')
  @ApiOperation({ summary: 'Staff break start' })
  async breakStart(@Param('staffId') staffId: string, @Body('type') type: string) {
    return await this.attendanceService.breakStart(staffId, type);
  }

  @Post('break-end/:staffId')
  @ApiOperation({ summary: 'Staff break end' })
  async breakEnd(@Param('staffId') staffId: string) {
    return await this.attendanceService.breakEnd(staffId);
  }

  @Get('staff/:staffId')
  @ApiOperation({ summary: 'Get attendance history for a staff' })
  async getStaffAttendance(@Param('staffId') staffId: string) {
    return await this.attendanceService.getStaffAttendance(staffId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all attendance records' })
  async getAllAttendance(@Query('date') date?: string) {
    return await this.attendanceService.getAllAttendance(date);
  }
}
