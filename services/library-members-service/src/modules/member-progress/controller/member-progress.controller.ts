import { Controller, Get, Param, Req } from '@nestjs/common';
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
  ) {
    return this.memberProgressService.getReadingActivity(memberId);
  }
}