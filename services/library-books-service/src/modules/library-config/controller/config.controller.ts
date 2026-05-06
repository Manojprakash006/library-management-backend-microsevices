import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '../service/config.service';
import { UpdateConfigDto } from '../dto/update-config.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Config')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get library configuration' })
  @ApiResponse({ status: 200, description: 'Config retrieved successfully' })
  async getConfig() {
    const config = await this.configService.getConfig();
    return { message: 'Config retrieved successfully', data: config };
  }

  @Patch()
  @Roles('admin')
  @ApiOperation({ summary: 'Update library configuration' })
  @ApiResponse({ status: 200, description: 'Config updated successfully' })
  async updateConfig(@Body() updateConfigDto: UpdateConfigDto) {
    const config = await this.configService.updateConfig(updateConfigDto);
    return { message: 'Config updated successfully', data: config };
  }
}
