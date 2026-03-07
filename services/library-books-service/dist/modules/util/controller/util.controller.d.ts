import { UtilService } from '../service/util.service';
export declare class UtilController {
    private readonly utilService;
    constructor(utilService: UtilService);
    healthCheck(): Promise<{
        message: string;
        data: {
            status: string;
            timestamp: string;
            uptime: number;
        };
    }>;
    ping(): Promise<{
        message: string;
        timestamp: string;
    }>;
}
