import { Controller, Get, Post, Param, Body, UsePipes, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FinesService } from '../service/fines.service';
import { PayFineDto } from '../dto/pay-fine.dto';

@ApiTags('fines')
@Controller('fines')
export class FinesController {
  constructor(private readonly finesService: FinesService) {}

  @Get('member/:memberId')
  @ApiOperation({ summary: 'Get all fines for a member' })
  @ApiParam({ name: 'memberId', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all fines for the member.' })
  async getFinesByMemberId(@Param('memberId') memberId: string) {
    return this.finesService.getFinesByMemberId(memberId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fine by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the fine.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Fine not found.' })
  async getFineById(@Param('id') id: string) {
    return this.finesService.getFineById(id);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Pay a fine' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Fine successfully paid.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async payFine(@Param('id') id: string, @Body() payFineDto: PayFineDto) {
    return this.finesService.payFine(id, payFineDto.paymentMethod, payFineDto.referenceId);
  }
}
