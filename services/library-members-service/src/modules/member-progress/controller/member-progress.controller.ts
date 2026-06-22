import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { MemberProgressService } from '../service/member-progress.service';

@Controller('member-progress')
export class MemberProgressController {
  constructor(
    private readonly memberProgressService: MemberProgressService,
  ) {}

  @Get('summary/:memberId')
  async getSummary(
    @Param('memberId') memberId: string,
    @Req() req: any,
  ) {
    const authHeader = req.headers.authorization;

    return this.memberProgressService.getSummary(
      memberId,
      authHeader,
    );
  }

  @Get('damage-history/:memberId')
  async getDamageHistory(
  @Param('memberId') memberId: string,
  ) {
  return this.memberProgressService.getDamageHistory(memberId);
  }

  @Get('reading-activity/:memberId')
  async getReadingActivity(
    @Param('memberId') memberId: string,
    @Query('year') year: string,
  ) {
    return this.memberProgressService.getReadingActivity(memberId, Number(year));
  }

  @Get('fine-payments/:memberId')
  async getFinePaymentActivity(
    @Param('memberId') memberId: string,
    @Query('year') year: string,
    @Req() req: any,
  ) {
    const authHeader = req.headers.authorization;
    return this.memberProgressService.getFinePaymentActivity(
      memberId,
      Number(year),
      authHeader,
    );
  }

  @Get('overdue-books/:memberId')
  async getOverdueBooks(
    @Param('memberId') memberId: string,
  ) {
    return this.memberProgressService.getOverdueBooks( memberId );
  }

  @Get('achievements')
  async getAchievements(
    @Req() req: any,
  ) {
    const authHeader = req.headers.authorization;
    return this.memberProgressService.getAchievements(
      req.user.id,
      authHeader
    );
  }
}