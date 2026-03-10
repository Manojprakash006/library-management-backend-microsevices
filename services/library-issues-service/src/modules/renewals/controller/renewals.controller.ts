import { Controller, Get, Post, Put, Delete, Body, Param, Query, Version, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RenewalsService } from '../service/renewals.service';
import { CreateBookRenewalDto, UpdateBookRenewalDto } from '../dto/create-book-renewal.dto';
import { BookRenewal } from '../entities/book-renewal.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Renewals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('renewals')
export class RenewalsController {
  constructor(private readonly renewalsService: RenewalsService) {}

   @Post()
  @Roles('admin', 'member')
  @ApiOperation({ summary: 'Create a new renewal request' })
  @ApiResponse({ status: 201, description: 'Renewal request created successfully', type: BookRenewal })
  async create(@Body() createBookRenewalDto: CreateBookRenewalDto): Promise<{ message: string; data: BookRenewal }> {
    const renewal = await this.renewalsService.create(createBookRenewalDto);
    return { message: 'Renewal request created successfully', data: renewal };
  }

   @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all renewal requests' })
  @ApiResponse({ status: 200, description: 'Renewal requests retrieved successfully', type: [BookRenewal] })
  async findAll(@Query('status') status?: string): Promise<{ message: string; data: BookRenewal[]; count: number }> {
    const renewals = await this.renewalsService.findAll(status);
    return { message: 'Renewal requests retrieved successfully', data: renewals, count: renewals.length };
  }

   @Get(':id')
  @Roles('admin', 'member')
  @ApiOperation({ summary: 'Get renewal request by ID' })
  @ApiResponse({ status: 200, description: 'Renewal request retrieved successfully', type: BookRenewal })
  @ApiResponse({ status: 404, description: 'Renewal request not found' })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: BookRenewal }> {
    const renewal = await this.renewalsService.findOne(id);
    return { message: 'Renewal request retrieved successfully', data: renewal };
  }

   @Put(':id/approve')
  @Roles('admin')
  @ApiOperation({ summary: 'Approve renewal request' })
  @ApiResponse({ status: 200, description: 'Renewal approved successfully', type: BookRenewal })
  @ApiResponse({ status: 404, description: 'Renewal request not found' })
  async approve(@Param('id') id: string): Promise<{ message: string; data: BookRenewal }> {
    const renewal = await this.renewalsService.approve(id);
    return { message: 'Renewal approved successfully', data: renewal };
  }

   @Put(':id/reject')
  @Roles('admin')
  @ApiOperation({ summary: 'Reject renewal request' })
  @ApiResponse({ status: 200, description: 'Renewal rejected successfully', type: BookRenewal })
  @ApiResponse({ status: 404, description: 'Renewal request not found' })
  async reject(@Param('id') id: string): Promise<{ message: string; data: BookRenewal }> {
    const renewal = await this.renewalsService.reject(id);
    return { message: 'Renewal rejected successfully', data: renewal };
  }

   @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete renewal request' })
  @ApiResponse({ status: 200, description: 'Renewal request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Renewal request not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.renewalsService.remove(id);
    return { message: 'Renewal request deleted successfully' };
  }
}
