import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MembersService } from '../service/members.service';
import { Public } from '../../../auth/guards/public.decorator';

@ApiTags('Public Stats')
@Controller('public-stats')
export class PublicStatsController {
    private lastCount: number = 0;
    private lastFetchTime: number = 0;
    private readonly CACHE_TIME = 30 * 60 * 1000; // 30 minutes cache

    constructor(private readonly membersService: MembersService) { }

    @Public()
    @Get('member-count')
    @ApiOperation({ summary: 'Get total members count for landing page (Cached)' })
    async getPublicCount() {
        const currentTime = Date.now();
        
        // Cache logic: DB will be hit only once every 30 minutes
        if (currentTime - this.lastFetchTime > this.CACHE_TIME || this.lastCount === 0) {
            this.lastCount = await this.membersService.getCount();
            this.lastFetchTime = currentTime;
        }
        
        return { data: this.lastCount };
    }
}
