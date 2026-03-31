import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LibraryVisitsService } from '../service/library-visits.service';
import { CheckInDto, CheckOutDto } from '../dto/library-visit.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { Public } from '../../../auth/guards/public.decorator';

@ApiTags('Library Visits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('library-visits')
export class LibraryVisitsController {
  constructor(private readonly libraryVisitsService: LibraryVisitsService) {}

  @Post('auto-record')
  @Public()
  @ApiOperation({ summary: 'Auto record library visit from issues service (internal)' })
  async autoRecordVisit(@Body() data: {
    memberId: string;
    bookId: string;
    purpose: string;
    timeIn: string;
    timeOut?: string;
    isAutoRecorded?: boolean;
  }) {
    const result = await this.libraryVisitsService.createVisitForBookIssue(
      data.memberId,
      data.bookId,
      data.purpose,
      new Date(data.timeIn),
      data.timeOut ? new Date(data.timeOut) : null
    );
    return { message: 'Library visit auto-recorded', data: result };
  }

  @Post('record-return')
  @Public()
  @ApiOperation({ summary: 'Record return visit when book is returned (internal)' })
  async recordReturn(@Body() data: {
    memberId: string;
    bookId: string;
  }) {
    const result = await this.libraryVisitsService.recordReturnVisit(
      data.memberId,
      data.bookId
    );
    return { message: 'Return visit recorded', data: result };
  }

  @Post('check-in')
  @Roles('staff', 'admin', 'member')
  @ApiOperation({ summary: 'Member check-in to library' })
  async checkIn(@Body() checkInDto: CheckInDto) {
    const result = await this.libraryVisitsService.checkIn(checkInDto);
    return { message: 'Check-in successful', data: result.data };
  }

  @Post('check-out')
  @Roles('staff', 'admin', 'member')
  @ApiOperation({ summary: 'Member check-out from library' })
  async checkOut(@Body() checkOutDto: CheckOutDto) {
    const result = await this.libraryVisitsService.checkOut(checkOutDto);
    return { message: 'Check-out successful', data: result.data };
  }

  @Get('today')
  @Roles('staff', 'admin')
  @ApiOperation({ summary: 'Get all visits for today' })
  async getTodaysVisits() {
    const visits = await this.libraryVisitsService.getTodaysVisits();
    return { message: 'Today\'s visits retrieved', data: visits };
  }

  @Get('active')
  @Roles('staff', 'admin')
  @ApiOperation({ summary: 'Get currently active visits' })
  async getActiveVisits() {
    const visits = await this.libraryVisitsService.getActiveVisits();
    return { message: 'Active visits retrieved', count: visits.length, data: visits };
  }

  @Get('my-history')
  @Roles('member')
  @ApiOperation({ summary: 'Get member own visit history' })
  async getMyHistory(@Request() req) {
    const memberId = req.user?.userId;
    const visits = await this.libraryVisitsService.getMemberVisitHistory(memberId);
    return { message: 'Visit history retrieved', data: visits };
  }
}
