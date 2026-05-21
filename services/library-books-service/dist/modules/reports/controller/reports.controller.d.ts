import { ReportsService } from '../service/reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getOverviewReport(req: any, filterType?: string, startDate?: string, endDate?: string): Promise<{
        message: string;
        data: any;
    }>;
    getStaffReport(req: any, filterType?: string, startDate?: string, endDate?: string): Promise<{
        message: string;
        data: any;
    }>;
    getBooksReport(req: any, filterType?: string, startDate?: string, endDate?: string): Promise<{
        message: string;
        data: any;
    }>;
    getMembersReport(req: any, filterType?: string, startDate?: string, endDate?: string): Promise<{
        message: string;
        data: any;
    }>;
    getPaymentsReport(req: any, filterType?: string, startDate?: string, endDate?: string): Promise<{
        message: string;
        data: any;
    }>;
    getRequestsReport(req: any, filterType?: string, startDate?: string, endDate?: string): Promise<{
        message: string;
        data: any;
    }>;
    getReviewsReport(req: any, filterType?: string, startDate?: string, endDate?: string): Promise<{
        message: string;
        data: any;
    }>;
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
