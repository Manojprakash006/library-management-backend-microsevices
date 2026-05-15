import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SystemConfigService } from '../service/system-config.service';
import { UpdateSystemConfigDto } from '../dto/update-system-config.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('System Config')
@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get system configuration' })
  async getConfig() {
    return await this.configService.getConfig();
  }

  @Patch()
  @ApiOperation({ summary: 'Update system configuration' })
  async updateConfig(@Body() dto: UpdateSystemConfigDto) {
    return await this.configService.updateConfig(dto);
  }
}
