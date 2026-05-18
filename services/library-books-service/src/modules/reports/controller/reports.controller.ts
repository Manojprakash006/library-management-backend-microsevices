import { Controller, Get, Param, Version, UseGuards, Req, Query } from '@nestjs/common';
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

  // --- NEW AGGREGATION ENDPOINTS FOR FRONTEND DASHBOARD ---

  @Get('overview')
  @Roles('admin')
  @ApiOperation({ summary: 'Get overview dashboard report' })
  @ApiResponse({ status: 200, description: 'Overview report retrieved successfully' })
  async getOverviewReport(
    @Req() req: any,
    @Query('filterType') filterType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ message: string; data: any }> {
    const authHeader = req.headers['authorization'];
    const data = await this.reportsService.getOverviewReport(authHeader, filterType, startDate, endDate);
    return { message: 'Overview report retrieved successfully', data };
  }

  @Get('staff')
  @Roles('admin')
  @ApiOperation({ summary: 'Get staff performance report' })
  @ApiResponse({ status: 200, description: 'Staff report retrieved successfully' })
  async getStaffReport(
    @Req() req: any,
    @Query('filterType') filterType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ message: string; data: any }> {
    const authHeader = req.headers['authorization'];
    const data = await this.reportsService.getStaffReport(authHeader, filterType, startDate, endDate);
    return { message: 'Staff report retrieved successfully', data };
  }

  @Get('books')
  @Roles('admin')
  @ApiOperation({ summary: 'Get book performance report' })
  @ApiResponse({ status: 200, description: 'Book report retrieved successfully' })
  async getBooksReport(
    @Req() req: any,
    @Query('filterType') filterType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ message: string; data: any }> {
    const authHeader = req.headers['authorization'];
    const data = await this.reportsService.getBooksReport(authHeader, filterType, startDate, endDate);
    return { message: 'Book report retrieved successfully', data };
  }

  @Get('members')
  @Roles('admin')
  @ApiOperation({ summary: 'Get member engagement report' })
  @ApiResponse({ status: 200, description: 'Member report retrieved successfully' })
  async getMembersReport(
    @Req() req: any,
    @Query('filterType') filterType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ message: string; data: any }> {
    const authHeader = req.headers['authorization'];
    const data = await this.reportsService.getMembersReport(authHeader, filterType, startDate, endDate);
    return { message: 'Member report retrieved successfully', data };
  }

  @Get('payments')
  @Roles('admin')
  @ApiOperation({ summary: 'Get payment financial report' })
  @ApiResponse({ status: 200, description: 'Payment report retrieved successfully' })
  async getPaymentsReport(
    @Req() req: any,
    @Query('filterType') filterType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ message: string; data: any }> {
    const authHeader = req.headers['authorization'];
    const data = await this.reportsService.getPaymentsReport(authHeader, filterType, startDate, endDate);
    return { message: 'Payment report retrieved successfully', data };
  }

  @Get('requests')
  @Roles('admin')
  @ApiOperation({ summary: 'Get book requests and trends report' })
  @ApiResponse({ status: 200, description: 'Requests report retrieved successfully' })
  async getRequestsReport(
    @Req() req: any,
    @Query('filterType') filterType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ message: string; data: any }> {
    const authHeader = req.headers['authorization'];
    const data = await this.reportsService.getRequestsReport(authHeader, filterType, startDate, endDate);
    return { message: 'Requests report retrieved successfully', data };
  }

  @Get('reviews')
  @Roles('admin')
  @ApiOperation({ summary: 'Get book reviews report' })
  @ApiResponse({ status: 200, description: 'Reviews report retrieved successfully' })
  async getReviewsReport(
    @Req() req: any,
    @Query('filterType') filterType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ message: string; data: any }> {
    const authHeader = req.headers['authorization'];
    const data = await this.reportsService.getReviewsReport(authHeader, filterType, startDate, endDate);
    return { message: 'Reviews report retrieved successfully', data };
  }

  // --- LEGACY BACKWARD COMPATIBLE ENDPOINTS ---

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all reports summary' })
  @ApiResponse({ status: 200, description: 'All reports retrieved successfully' })
  async getAllReports(@Req() req: any): Promise<{ message: string; data: any }> {
    const authHeader = req.headers['authorization'];
    const reports = await this.reportsService.getAllReports(authHeader as string);
    return { message: 'All reports retrieved successfully', data: reports };
  }

  @Get('daily-issue-return')
  @Roles('admin')
  @ApiOperation({ summary: 'Get daily issue and return report' })
  @ApiResponse({ status: 200, description: 'Daily issue and return report retrieved successfully' })
  async getDailyIssueReturnReport(): Promise<{ message: string; data: any }> {
    const report = await this.reportsService.getDailyIssueReturnReport();
    return { message: 'Daily issue and return report retrieved successfully', data: report };
  }

  @Get('overdue')
  @Roles('admin')
  @ApiOperation({ summary: 'Get overdue books report' })
  @ApiResponse({ status: 200, description: 'Overdue report retrieved successfully' })
  async getOverdueReport(): Promise<{ message: string; data: any }> {
    const report = await this.reportsService.getOverdueReport();
    return { message: 'Overdue report retrieved successfully', data: report };
  }

  @Get('rack-inventory')
  @Roles('admin')
  @ApiOperation({ summary: 'Get rack inventory report' })
  @ApiResponse({ status: 200, description: 'Rack inventory report retrieved successfully' })
  async getRackInventoryReport(): Promise<{ message: string; data: any[]; count: number }> {
    const report = await this.reportsService.getRackInventoryReport();
    const totalBooks = report.reduce((sum, rack) => sum + rack.total, 0);
    return { message: 'Rack inventory report retrieved successfully', data: report, count: totalBooks };
  }

  @Get('rack-inventory/:rackNumber')
  @Roles('admin')
  @ApiOperation({ summary: 'Get rack inventory by rack number' })
  @ApiResponse({ status: 200, description: 'Rack inventory details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Rack not found' })
  async getRackInventoryById(@Param('rackNumber') rackNumber: string): Promise<{ message: string; data: any }> {
    const report = await this.reportsService.getRackInventoryById(rackNumber);
    return { message: 'Rack inventory details retrieved successfully', data: report };
  }

  @Get('member-activity')
  @Roles('admin')
  @ApiOperation({ summary: 'Get member activity report' })
  @ApiResponse({ status: 200, description: 'Member activity report retrieved successfully' })
  async getMemberActivityReport(@Req() req: any): Promise<{ message: string; data: any }> {
    const authHeader = req.headers['authorization'];
    const report = await this.reportsService.getMemberActivityReport(authHeader as string);
    return { message: 'Member activity report retrieved successfully', data: report };
  }
}
