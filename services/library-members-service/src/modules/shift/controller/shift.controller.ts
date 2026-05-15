import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShiftService } from '../service/shift.service';
import { CreateShiftDto, UpdateShiftDto } from '../dto/shift.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/guards/roles.decorator';

@ApiTags('Shifts')
@Controller('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new shift' })
  async create(@Body() dto: CreateShiftDto) {
    return await this.shiftService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active shifts' })
  async findAll() {
    return await this.shiftService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shift by ID' })
  async findOne(@Param('id') id: string) {
    return await this.shiftService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a shift' })
  async update(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
    return await this.shiftService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Deactivate a shift' })
  async remove(@Param('id') id: string) {
    return await this.shiftService.remove(id);
  }
}
