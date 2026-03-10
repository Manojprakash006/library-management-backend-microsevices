import { Controller, Get, Param, Version, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RacksService } from '../service/racks.service';
import { RackDto } from '../dto/rack.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Racks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('racks')
export class RacksController {
  constructor(private readonly racksService: RacksService) {}

   @Get()
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Get all racks with book summary' })
  @ApiResponse({ status: 200, description: 'Racks retrieved successfully', type: [RackDto] })
  async findAll(): Promise<{ message: string; data: RackDto[]; count: number }> {
    const racks = await this.racksService.findAll();
    return { message: 'Racks retrieved successfully', data: racks, count: racks.length };
  }

   @Get(':rackNumber')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Get rack details by rack number' })
  @ApiResponse({ status: 200, description: 'Rack details retrieved successfully', type: RackDto })
  @ApiResponse({ status: 404, description: 'Rack not found' })
  async findOne(@Param('rackNumber') rackNumber: string): Promise<{ message: string; data: RackDto }> {
    const rack = await this.racksService.findByRackNumber(rackNumber);
    return { message: 'Rack details retrieved successfully', data: rack };
  }
}
