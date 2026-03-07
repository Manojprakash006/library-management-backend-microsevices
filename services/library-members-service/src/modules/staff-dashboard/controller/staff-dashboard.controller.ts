import { Controller, Get, Post, Body, Param, Version, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StaffDashboardService } from '../service/staff-dashboard.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiTags('Staff Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff-dashboard')
export class StaffDashboardController {
  constructor(private readonly staffDashboardService: StaffDashboardService) {}

  @Version('1')
  @Get('stats')
  @Roles('staff')
  @ApiOperation({ summary: 'Get staff dashboard stats' })
  async getStaffStats() {
    const result = await this.staffDashboardService.getStaffStats();
    return { message: 'Stats retrieved successfully', data: result };
  }

  @Version('1')
  @Get('recent-issues')
  @Roles('staff')
  @ApiOperation({ summary: 'Get recent book issues' })
  async getRecentIssues() {
    const result = await this.staffDashboardService.getRecentIssues();
    return { message: 'Recent issues retrieved', data: result };
  }

  @Version('1')
  @Get('overdue-books')
  @Roles('staff')
  @ApiOperation({ summary: 'Get all overdue books' })
  async getOverdueBooks() {
    const result = await this.staffDashboardService.getOverdueBooks();
    return { message: 'Overdue books retrieved', data: result };
  }

  @Version('1')
  @Get('pending-requests')
  @Roles('staff')
  @ApiOperation({ summary: 'Get pending book requests' })
  async getPendingRequests() {
    const result = await this.staffDashboardService.getPendingRequests();
    return { message: 'Pending requests retrieved', data: result };
  }

  @Version('1')
  @Get('stat-cards')
  @Roles('staff')
  @ApiOperation({ summary: 'Get staff stat cards' })
  async getStaffStatCards() {
    const result = await this.staffDashboardService.getStatCards();
    return { message: 'Stat cards retrieved successfully', data: result };
  }

  @Version('1')
  @Get('books-added-today')
  @Roles('staff')
  @ApiOperation({ summary: 'Get books added today' })
  async getBooksAddedToday() {
    const result = await this.staffDashboardService.getBooksAddedToday();
    return { message: 'Books added today retrieved', data: result };
  }

  @Version('1')
  @Get('recent-activities')
  @Roles('staff')
  @ApiOperation({ summary: 'Get recent activities' })
  async getRecentActivities() {
    const result = await this.staffDashboardService.getRecentActivities();
    return { message: 'Recent activities retrieved', data: result };
  }

  @Version('1')
  @Get('rack-distribution')
  @Roles('staff')
  @ApiOperation({ summary: 'Get rack distribution' })
  async getRackDistribution() {
    const result = await this.staffDashboardService.getRackDistribution();
    return { message: 'Rack distribution retrieved', data: result };
  }

  @Version('1')
  @Post('books')
  @Roles('staff')
  @ApiOperation({ summary: 'Create a new book' })
  async createBook(@Body() bookData: any) {
    const result = await this.staffDashboardService.createBook(bookData);
    return { message: 'Book created successfully', data: result };
  }

  @Version('1')
  @Get('my-activity-logs')
  @Roles('staff')
  @ApiOperation({ summary: 'Get my activity logs' })
  async getMyActivityLogs(@Request() req) {
    const result = await this.staffDashboardService.getMyActivityLogs(req.user.userId);
    return { message: 'Activity logs retrieved', data: result };
  }

  @Version('1')
  @Get('my-profile')
  @Roles('staff')
  @ApiOperation({ summary: 'Get my profile' })
  async getMyProfile(@Request() req) {
    const result = await this.staffDashboardService.getMyProfile(req.user.userId);
    return { message: 'Profile retrieved', data: result };
  }

  @Version('1')
  @Get('my-contribution')
  @Roles('staff')
  @ApiOperation({ summary: 'Get my contribution' })
  async getMyContribution(@Request() req) {
    const result = await this.staffDashboardService.getMyContribution(req.user.userId);
    return { message: 'Contribution data retrieved', data: result };
  }

  @Version('1')
  @Get('books-by-category')
  @Roles('staff')
  @ApiOperation({ summary: 'Get books by category' })
  async getBooksByCategory() {
    const result = await this.staffDashboardService.getBooksByCategory();
    return { message: 'Books by category retrieved', data: result };
  }

  @Version('1')
  @Get('rack-utilization')
  @Roles('staff')
  @ApiOperation({ summary: 'Get rack utilization' })
  async getRackUtilization() {
    const result = await this.staffDashboardService.getRackUtilization();
    return { message: 'Rack utilization retrieved', data: result };
  }

  @Version('1')
  @Get('books-status-distribution')
  @Roles('staff')
  @ApiOperation({ summary: 'Get books status distribution' })
  async getBooksStatusDistribution() {
    const result = await this.staffDashboardService.getBooksStatusDistribution();
    return { message: 'Books status distribution retrieved', data: result };
  }
}
