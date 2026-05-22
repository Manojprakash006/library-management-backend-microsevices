import { ReportsService } from '../service/reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getAllReports(req: any): Promise<{
        message: string;
        data: any;
    }>;
    getDailyIssueReturnReport(): Promise<{
        message: string;
        data: any;
    }>;
    getOverdueReport(): Promise<{
        message: string;
        data: any;
    }>;
    getRackInventoryReport(): Promise<{
        message: string;
        data: any[];
        count: number;
    }>;
    getRackInventoryById(rackNumber: string): Promise<{
        message: string;
        data: any;
    }>;
    getMemberActivityReport(req: any): Promise<{
        message: string;
        data: any;
    }>;
}
