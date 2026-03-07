export declare class UtilService {
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
    }>;
}
