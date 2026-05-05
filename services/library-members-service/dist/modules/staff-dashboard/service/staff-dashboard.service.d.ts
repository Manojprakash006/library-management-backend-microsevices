import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Member } from '../../members/entities/member.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { LibraryVisit } from '../../library-visits/entities/library-visit.entity';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';
export declare class StaffDashboardService {
    private memberModel;
    private staffModel;
    private libraryVisitModel;
    private readonly httpService;
    private readonly activityLogService;
    private readonly logger;
    constructor(memberModel: Model<Member>, staffModel: Model<Staff>, libraryVisitModel: Model<LibraryVisit>, httpService: HttpService, activityLogService: ActivityLogService);
    private getBooksAddedTodayCount;
    getStaffStats(authHeader?: string): Promise<{
        totalBooks: number;
        availableBooks: number;
        issuedBooks: number;
        todayBookAdded: number;
    }>;
    getBooksAddedTodayList(authHeader?: string): Promise<any[]>;
    getRecentIssues(): Promise<any[]>;
    getOverdueBooks(): Promise<any[]>;
    getPendingRequests(): Promise<any[]>;
    getStatCards(): Promise<{
        totalBooks: number;
        totalMembers: number;
        booksIssuedToday: number;
        booksReturnedToday: number;
        overdueBooks: number;
        pendingRequests: number;
    }>;
    getBooksAddedToday(authHeader?: string): Promise<any[]>;
    getRecentActivities(): Promise<any[]>;
    getRackDistribution(authHeader?: string): Promise<any[]>;
    createBook(bookData: any, staffId: string, authHeader?: string): Promise<{
        message: string;
        data: any;
    }>;
    getMyProfile(staffId: string): Promise<any>;
    getMyContribution(staffId: string): Promise<{
        totalActivities: number;
        todaysActivities: number;
    }>;
    getMyActivitySummary(staffId: string): Promise<{
        totalActivitiesBooksAdded: number;
        todaysActivitiesBooksAdded: number;
        recentActivities: {
            action: any;
            date: any;
            description: any;
            referenceId: any;
        }[];
    }>;
    getBooksByCategory(authHeader?: string): Promise<any>;
    getRackUtilization(authHeader?: string): Promise<{
        rackNumber: any;
        usedCount: any;
        totalBooks: any;
        capacity: any;
    }[]>;
    getBooksStatusDistribution(authHeader?: string): Promise<{
        available: any;
        issued: any;
    }>;
    getTodaysVisitors(authHeader?: string): Promise<((import("mongoose").Document<unknown, {}, LibraryVisit, {}, {}> & LibraryVisit & {
        _id: Types.ObjectId;
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
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
        timeIn: any;
        timeOut: any;
        purpose: string;
        isAutoRecorded: boolean;
        isActive: boolean;
        notes: string;
    })[]>;
    getTodaysIssues(authHeader?: string): Promise<any[]>;
}
