import { StaffDashboardService } from '../service/staff-dashboard.service';
import { CreateBookDto } from '../dto/create-book.dto';
export declare class StaffDashboardController {
    private readonly staffDashboardService;
    constructor(staffDashboardService: StaffDashboardService);
    getStaffStats(req: any): Promise<{
        message: string;
        data: {
            totalBooks: number;
            availableBooks: number;
            issuedBooks: number;
            todayBookAdded: number;
        };
    }>;
    getRecentIssues(): Promise<{
        message: string;
        data: any[];
    }>;
    getOverdueBooks(): Promise<{
        message: string;
        data: any[];
    }>;
    getPendingRequests(): Promise<{
        message: string;
        data: any[];
    }>;
    getStaffStatCards(): Promise<{
        message: string;
        data: {
            totalBooks: number;
            totalMembers: number;
            booksIssuedToday: number;
            booksReturnedToday: number;
            overdueBooks: number;
            pendingRequests: number;
        };
    }>;
    getBooksAddedTodayList(req: any): Promise<{
        message: string;
        data: any[];
    }>;
    getBooksAddedToday(req: any): Promise<{
        message: string;
        data: any[];
    }>;
    getRackDistribution(req: any): Promise<{
        message: string;
        data: any[];
    }>;
    createBook(bookData: CreateBookDto, req: any): Promise<{
        message: string;
        data: {
            message: string;
            data: any;
        };
    }>;
    getMyActivitySummary(req: any): Promise<{
        message: string;
        data: {
            totalActivitiesBooksAdded: number;
            todaysActivitiesBooksAdded: number;
            recentActivities: {
                action: any;
                date: any;
                description: any;
                referenceId: any;
            }[];
        };
    }>;
    getMyContribution(req: any): Promise<{
        message: string;
        data: {
            totalActivities: number;
            todaysActivities: number;
        };
    }>;
    getMyProfile(req: any): Promise<{
        message: string;
        data: any;
    }>;
    getBooksByCategory(req: any): Promise<{
        message: string;
        data: any;
    }>;
    getRackUtilization(req: any): Promise<{
        message: string;
        data: {
            rackNumber: any;
            usedCount: any;
            totalBooks: any;
            capacity: any;
        }[];
    }>;
    getBooksStatusDistribution(req: any): Promise<{
        message: string;
        data: {
            available: any;
            issued: any;
        };
    }>;
    getTodaysVisitors(req: any): Promise<{
        message: string;
        count: number;
        data: ((import("mongoose").Document<unknown, {}, import("../../library-visits/entities/library-visit.entity").LibraryVisit, {}, {}> & import("../../library-visits/entities/library-visit.entity").LibraryVisit & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | {
            _id: string;
            memberId: import("mongoose").FlattenMaps<{
                memberId: string;
                name: string;
                email: string;
                phoneNumber: string;
                address: string;
                password: string;
                membershipDate: Date;
                isActive: boolean;
                booksHeld: number;
                booksAtHome: number;
                readingInsideLibrary: number;
                totalFines: number;
                hasActiveIssues: boolean;
                reviews: {
                    bookId: string;
                    rating: number;
                    comment: string;
                    createdAt: Date;
                }[];
                borrowingHistory: {
                    bookId: string;
                    issueId: string;
                    bookTitle?: string;
                    borrowedAt: Date;
                    dueDate?: Date;
                    returnedAt?: Date;
                    status: "borrowed" | "returned" | "overdue";
                    fine: number;
                }[];
                resetPasswordToken: string;
                resetPasswordExpires: Date;
            }> & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
            timeIn: any;
            timeOut: any;
            purpose: string;
            isAutoRecorded: boolean;
            isActive: boolean;
            notes: string;
        })[];
    }>;
    getTodaysIssues(req: any): Promise<{
        message: string;
        count: number;
        data: any[];
    }>;
}
