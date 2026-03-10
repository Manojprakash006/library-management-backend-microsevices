import { Controller, Get, Post, Put, Delete, Body, Param, Query, Version, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DamageReportsService } from '../service/damage-reports.service';
import { CreateBookDamageReportDto, UpdateBookDamageReportDto } from '../dto/create-book-damage-report.dto';
import { BookDamageReport } from '../entities/book-damage-report.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Damage Reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('damage-reports')
export class DamageReportsController {
  constructor(private readonly damageReportsService: DamageReportsService) {}

   @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new damage report' })
  @ApiResponse({ status: 201, description: 'Damage report created successfully', type: BookDamageReport })
  async create(@Body() createBookDamageReportDto: CreateBookDamageReportDto): Promise<{ message: string; data: BookDamageReport }> {
    const report = await this.damageReportsService.create(createBookDamageReportDto);
    return { message: 'Damage report created successfully', data: report };
  }

   @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all damage reports' })
  @ApiResponse({ status: 200, description: 'Damage reports retrieved successfully', type: [BookDamageReport] })
  async findAll(@Query('status') status?: string): Promise<{ message: string; data: BookDamageReport[]; count: number }> {
    const reports = await this.damageReportsService.findAll(status);
    return { message: 'Damage reports retrieved successfully', data: reports, count: reports.length };
  }

   @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get damage report by ID' })
  @ApiResponse({ status: 200, description: 'Damage report retrieved successfully', type: BookDamageReport })
  @ApiResponse({ status: 404, description: 'Damage report not found' })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: BookDamageReport }> {
    const report = await this.damageReportsService.findOne(id);
    return { message: 'Damage report retrieved successfully', data: report };
  }

   @Put(':id/approve')
  @Roles('admin')
  @ApiOperation({ summary: 'Approve damage report' })
  @ApiResponse({ status: 200, description: 'Damage report approved successfully', type: BookDamageReport })
  @ApiResponse({ status: 404, description: 'Damage report not found' })
  async approve(@Param('id') id: string): Promise<{ message: string; data: BookDamageReport }> {
    const report = await this.damageReportsService.approve(id);
    return { message: 'Damage report approved successfully', data: report };
  }

   @Put(':id/reject')
  @Roles('admin')
  @ApiOperation({ summary: 'Reject damage report' })
  @ApiResponse({ status: 200, description: 'Damage report rejected successfully', type: BookDamageReport })
  @ApiResponse({ status: 404, description: 'Damage report not found' })
  async reject(@Param('id') id: string): Promise<{ message: string; data: BookDamageReport }> {
    const report = await this.damageReportsService.reject(id);
    return { message: 'Damage report rejected successfully', data: report };
  }

   @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete damage report' })
  @ApiResponse({ status: 200, description: 'Damage report deleted successfully' })
  @ApiResponse({ status: 404, description: 'Damage report not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.damageReportsService.remove(id);
    return { message: 'Damage report deleted successfully' };
  }
}
