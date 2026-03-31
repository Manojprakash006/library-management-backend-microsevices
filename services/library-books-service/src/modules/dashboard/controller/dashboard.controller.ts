import { Controller, Get, Version, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from '../service/dashboard.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Request } from 'express';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats() {
    const result = await this.dashboardService.getDashboardStats();
    return { message: 'Dashboard stats retrieved', data: result };
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory summary' })
  async getInventorySummary() {
    const result = await this.dashboardService.getInventorySummary();
    return { message: 'Inventory summary retrieved', data: result };
  }

  @Get('popular-books')
  @ApiOperation({ summary: 'Get popular books' })
  async getPopularBooks() {
    const result = await this.dashboardService.getPopularBooks();
    return { message: 'Popular books retrieved', data: result };
  }

  @Get('stat-cards')
  @ApiOperation({ summary: 'Get stat cards data' })
  async getStatCards(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const result = await this.dashboardService.getStatCards(authHeader as string);
    return { message: 'Stat cards retrieved', data: result };
  }

   @Get('recent-books')
  @ApiOperation({ summary: 'Get recent books' })
  async getRecentBooks(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const result = await this.dashboardService.getRecentBooks(authHeader as string);
    return { message: 'Recent books retrieved', data: result };
  }

   @Get('overdue-books')
  @ApiOperation({ summary: 'Get overdue books' })
  async getOverdueBooks(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const result = await this.dashboardService.getOverdueBooks(authHeader as string);
    return { message: 'Overdue books retrieved', data: result };
  }

   @Get('pending-requests')
  @ApiOperation({ summary: 'Get pending requests' })
  async getPendingRequests(@Req() req: Request): Promise<{ message: string; data: any[] }> {
    const authHeader = req.headers['authorization'];
    const result = await this.dashboardService.getPendingRequests(authHeader as string);
    return { message: 'Pending requests retrieved', data: result };
  }

   @Get('pending')
  @ApiOperation({ summary: 'Get pending requests (alias)' })
  async getPending(@Req() req: Request): Promise<{ message: string; data: any[] }> {
    const authHeader = req.headers['authorization'];
    const result = await this.dashboardService.getPendingRequests(authHeader as string);
    return { message: 'Pending requests retrieved', data: result };
  }
}
