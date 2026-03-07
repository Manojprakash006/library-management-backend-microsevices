import { Controller, Get, Version, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from '../service/dashboard.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Version('1')
  @Get()
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats() {
    const result = await this.dashboardService.getDashboardStats();
    return { message: 'Dashboard stats retrieved', data: result };
  }

  @Version('1')
  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory summary' })
  async getInventorySummary() {
    const result = await this.dashboardService.getInventorySummary();
    return { message: 'Inventory summary retrieved', data: result };
  }

  @Version('1')
  @Get('popular-books')
  @ApiOperation({ summary: 'Get popular books' })
  async getPopularBooks() {
    const result = await this.dashboardService.getPopularBooks();
    return { message: 'Popular books retrieved', data: result };
  }

  @Version('1')
  @Get('stat-cards')
  @ApiOperation({ summary: 'Get stat cards data' })
  async getStatCards() {
    const result = await this.dashboardService.getStatCards();
    return { message: 'Stat cards retrieved', data: result };
  }

  @Version('1')
  @Get('recent-books')
  @ApiOperation({ summary: 'Get recent books' })
  async getRecentBooks() {
    const result = await this.dashboardService.getRecentBooks();
    return { message: 'Recent books retrieved', data: result };
  }

  @Version('1')
  @Get('overdue-books')
  @ApiOperation({ summary: 'Get overdue books' })
  async getOverdueBooks() {
    const result = await this.dashboardService.getOverdueBooks();
    return { message: 'Overdue books retrieved', data: result };
  }

  @Version('1')
  @Get('pending-requests')
  @ApiOperation({ summary: 'Get pending requests' })
  async getPendingRequests() {
    const result = await this.dashboardService.getPendingRequests();
    return { message: 'Pending requests retrieved', data: result };
  }

  @Version('1')
  @Get('pending')
  @ApiOperation({ summary: 'Get pending requests (alias)' })
  async getPending() {
    const result = await this.dashboardService.getPendingRequests();
    return { message: 'Pending requests retrieved', data: result };
  }
}
