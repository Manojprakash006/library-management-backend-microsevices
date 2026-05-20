import { MembersService } from '../service/members.service';
export declare class PublicStatsController {
    private readonly membersService;
    private lastCount;
    private lastFetchTime;
    private readonly CACHE_TIME;
    constructor(membersService: MembersService);
    getPublicCount(): Promise<{
        data: number;
    }>;
}
