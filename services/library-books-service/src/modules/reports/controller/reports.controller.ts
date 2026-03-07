import { Controller, Get, Param, Version, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from '../service/reports.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Version('1')
  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all reports summary' })
  @ApiResponse({ status: 200, description: 'All reports retrieved successfully' })
  async getAllReports(): Promise<{ message: string; data: any }> {
    const reports = await this.reportsService.getAllReports();
    return { message: 'All reports retrieved successfully', data: reports };
  }

  @Version('1')
  @Get('daily-issue-return')
  @Roles('admin')
  @ApiOperation({ summary: 'Get daily issue and return report' })
  @ApiResponse({ status: 200, description: 'Daily issue and return report retrieved successfully' })
  async getDailyIssueReturnReport(): Promise<{ message: string; data: any }> {
    const report = await this.reportsService.getDailyIssueReturnReport();
    return { message: 'Daily issue and return report retrieved successfully', data: report };
  }

  @Version('1')
  @Get('overdue')
  @Roles('admin')
  @ApiOperation({ summary: 'Get overdue books report' })
  @ApiResponse({ status: 200, description: 'Overdue report retrieved successfully' })
  async getOverdueReport(): Promise<{ message: string; data: any }> {
    const report = await this.reportsService.getOverdueReport();
    return { message: 'Overdue report retrieved successfully', data: report };
  }

  @Version('1')
  @Get('rack-inventory')
  @Roles('admin')
  @ApiOperation({ summary: 'Get rack inventory report' })
  @ApiResponse({ status: 200, description: 'Rack inventory report retrieved successfully' })
  async getRackInventoryReport(): Promise<{ message: string; data: any[]; count: number }> {
    const report = await this.reportsService.getRackInventoryReport();
    return { message: 'Rack inventory report retrieved successfully', data: report, count: report.length };
  }

  @Version('1')
  @Get('rack-inventory/:rackNumber')
  @Roles('admin')
  @ApiOperation({ summary: 'Get rack inventory by rack number' })
  @ApiResponse({ status: 200, description: 'Rack inventory details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Rack not found' })
  async getRackInventoryById(@Param('rackNumber') rackNumber: string): Promise<{ message: string; data: any }> {
    const report = await this.reportsService.getRackInventoryById(rackNumber);
    return { message: 'Rack inventory details retrieved successfully', data: report };
  }

  @Version('1')
  @Get('member-activity')
  @Roles('admin')
  @ApiOperation({ summary: 'Get member activity report' })
  @ApiResponse({ status: 200, description: 'Member activity report retrieved successfully' })
  async getMemberActivityReport(): Promise<{ message: string; data: any }> {
    const report = await this.reportsService.getMemberActivityReport();
    return { message: 'Member activity report retrieved successfully', data: report };
  }
}
