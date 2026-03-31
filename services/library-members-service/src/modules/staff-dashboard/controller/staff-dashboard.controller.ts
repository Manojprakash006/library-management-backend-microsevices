import { Controller, Get, Post, Body, Param, Version, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StaffDashboardService } from '../service/staff-dashboard.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { CreateBookDto } from '../dto/create-book.dto';

@ApiTags('Staff Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff-dashboard')
export class StaffDashboardController {
  constructor(private readonly staffDashboardService: StaffDashboardService) { }

  @Get('stats')
  @Roles('staff')
  @ApiOperation({ summary: 'Get staff dashboard stats' })
  async getStaffStats(@Request() req) {
    const authHeader = req.headers['authorization'];
    const result = await this.staffDashboardService.getStaffStats(authHeader);
    return { message: 'Stats retrieved successfully', data: result };
  }

  @Get('recent-issues')
  @Roles('staff')
  @ApiOperation({ summary: 'Get recent book issues' })
  async getRecentIssues() {
    const result = await this.staffDashboardService.getRecentIssues();
    return { message: 'Recent issues retrieved', data: result };
  }

  @Get('overdue-books')
  @Roles('staff')
  @ApiOperation({ summary: 'Get all overdue books' })
  async getOverdueBooks() {
    const result = await this.staffDashboardService.getOverdueBooks();
    return { message: 'Overdue books retrieved', data: result };
  }

  @Get('pending-requests')
  @Roles('staff')
  @ApiOperation({ summary: 'Get pending book requests' })
  async getPendingRequests() {
    const result = await this.staffDashboardService.getPendingRequests();
    return { message: 'Pending requests retrieved', data: result };
  }

  @Get('stat-cards')
  @Roles('staff')
  @ApiOperation({ summary: 'Get staff stat cards' })
  async getStaffStatCards() {
    const result = await this.staffDashboardService.getStatCards();
    return { message: 'Stat cards retrieved successfully', data: result };
  }

  @Get('books-added-today')
  @Roles('staff')
  @ApiOperation({ summary: 'Get books added today' })
  async getBooksAddedToday(@Request() req) {
    const authHeader = req.headers['authorization'];
    const result = await this.staffDashboardService.getBooksAddedToday(authHeader);
    return { message: 'Books added today retrieved', data: result };
  }



  @Get('rack-distribution')
  @Roles('staff')
  @ApiOperation({ summary: 'Get rack distribution' })
  async getRackDistribution(@Request() req) {
    const authHeader = req.headers['authorization'];
    const result = await this.staffDashboardService.getRackDistribution(authHeader);
    return { message: 'Rack distribution retrieved', data: result };
  }

  @Post('books')
  @Roles('staff')
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createBook(@Body() bookData: CreateBookDto, @Request() req) {
    const authHeader = req.headers['authorization'];
    const staffId = req.user?.userId;
    const result = await this.staffDashboardService.createBook(bookData, staffId, authHeader);
    return { message: 'Book created successfully', data: result };
  }



  @Get('my-profile')
  @Roles('staff')
  @ApiOperation({ summary: 'Get my profile' })
  async getMyProfile(@Request() req) {
    const result = await this.staffDashboardService.getMyProfile(req.user.userId);
    return { message: 'Profile retrieved', data: result };
  }



  @Get('books-by-category')
  @Roles('staff')
  @ApiOperation({ summary: 'Get books by category' })
  async getBooksByCategory() {
    const result = await this.staffDashboardService.getBooksByCategory();
    return { message: 'Books by category retrieved', data: result };
  }

  @Get('rack-utilization')
  @Roles('staff')
  @ApiOperation({ summary: 'Get rack utilization' })
  async getRackUtilization() {
    const result = await this.staffDashboardService.getRackUtilization();
    return { message: 'Rack utilization retrieved', data: result };
  }

  @Get('books-status-distribution')
  @Roles('staff')
  @ApiOperation({ summary: 'Get books status distribution' })
  async getBooksStatusDistribution() {
    const result = await this.staffDashboardService.getBooksStatusDistribution();
    return { message: 'Books status distribution retrieved', data: result };
  }

  @Get('todays-visitors')
  @Roles('staff')
  @ApiOperation({ summary: 'Get todays library visitors' })
  async getTodaysVisitors() {
    const result = await this.staffDashboardService.getTodaysVisitors();
    return { message: 'Today\'s visitors retrieved', count: result.length, data: result };
  }

  @Get('todays-issues')
  @Roles('staff')
  @ApiOperation({ summary: 'Get todays book issues' })
  async getTodaysIssues(@Request() req) {
    const authHeader = req.headers['authorization'];
    const result = await this.staffDashboardService.getTodaysIssues(authHeader);
    return { message: 'Today\'s book issues retrieved', count: result.length, data: result };
  }
}
