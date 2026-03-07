import { Controller, Get, Delete, Version } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UtilService } from '../service/util.service';

@ApiTags('Util')
@Controller('util')
export class UtilController {
  constructor(private readonly utilService: UtilService) {}

  @Version('1')
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  async healthCheck() {
    const result = await this.utilService.healthCheck();
    return { message: 'Health check completed', data: result };
  }

  @Version('1')
  @Get('ping')
  @ApiOperation({ summary: 'Ping service' })
  async ping() {
    return { message: 'Pong', timestamp: new Date().toISOString() };
  }

  @Version('1')
  @Delete('clear-all')
  @ApiOperation({ summary: 'Clear all products' })
  async clearAll() {
    const result = await this.utilService.clearAll();
    return result;
  }
}
