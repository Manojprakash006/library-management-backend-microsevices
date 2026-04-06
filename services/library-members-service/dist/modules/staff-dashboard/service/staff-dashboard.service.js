"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StaffDashboardService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffDashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const member_entity_1 = require("../../members/entities/member.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const library_visit_entity_1 = require("../../library-visits/entities/library-visit.entity");
const activity_log_service_1 = require("../../activity-log/service/activity-log.service");
let StaffDashboardService = StaffDashboardService_1 = class StaffDashboardService {
    constructor(memberModel, staffModel, libraryVisitModel, httpService, activityLogService) {
        this.memberModel = memberModel;
        this.staffModel = staffModel;
        this.libraryVisitModel = libraryVisitModel;
        this.httpService = httpService;
        this.activityLogService = activityLogService;
        this.logger = new common_1.Logger(StaffDashboardService_1.name);
    }
    async getStaffStats(authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            this.logger.log(`Fetching stats from books service: ${booksServiceUrl}/dashboard/stat-cards`);
            const statsResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/dashboard/stat-cards`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            this.logger.log(`Books service response: ${JSON.stringify(statsResponse.data)}`);
            const stats = statsResponse.data?.data || {
                totalBooks: 0,
                availableBooks: 0,
                issuedBooks: 0,
            };
            this.logger.log(`Parsed stats: ${JSON.stringify(stats)}`);
            const todayBookAdded = await this.getBooksAddedTodayCount(authHeader);
            return {
                totalBooks: stats.totalBooks || 0,
                availableBooks: stats.availableBooks || 0,
                issuedBooks: stats.issuedBooks || 0,
                todayBookAdded: todayBookAdded,
            };
        }
        catch (error) {
            this.logger.error(`Failed to fetch stats from books service: ${error.message}`);
            this.logger.error(`Error details: ${JSON.stringify(error.response?.data || error)}`);
            return {
                totalBooks: 0,
                availableBooks: 0,
                issuedBooks: 0,
                todayBookAdded: 0,
            };
        }
    }
    async getBooksAddedTodayCount(authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/books`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const books = response.data?.data || [];
            const todayBookAdded = books.filter((book) => {
                const createdAt = new Date(book.createdAt);
                return createdAt >= today;
            }).length;
            return todayBookAdded;
        }
        catch (error) {
            this.logger.error(`Failed to fetch books added today: ${error.message}`);
            return 0;
        }
    }
    async getRecentIssues() {
        return [];
    }
    async getOverdueBooks() {
        return [];
    }
    async getPendingRequests() {
        return [];
    }
    async getStatCards() {
        return {
            totalBooks: 0,
            totalMembers: await this.memberModel.countDocuments(),
            booksIssuedToday: 0,
            booksReturnedToday: 0,
            overdueBooks: 0,
            pendingRequests: 0,
        };
    }
    async getBooksAddedToday(authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            this.logger.log(`Fetching books added today`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/books`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const books = response.data?.data || [];
            const todayBooks = books.filter((book) => {
                const createdAt = new Date(book.createdAt);
                return createdAt >= today;
            });
            this.logger.log(`Found ${todayBooks.length} books added today`);
            return todayBooks;
        }
        catch (error) {
            this.logger.error(`Failed to fetch books added today: ${error.message}`);
            return [];
        }
    }
    async getRecentActivities() {
        return [];
    }
    async getRackDistribution(authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            this.logger.log(`Fetching rack distribution from: ${booksServiceUrl}/racks`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/racks`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const racks = response.data?.data || [];
            this.logger.log(`Found ${racks.length} racks`);
            return racks;
        }
        catch (error) {
            this.logger.error(`Failed to fetch rack distribution: ${error.message}`);
            return [];
        }
    }
    async createBook(bookData, staffId, authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            this.logger.log(`Creating book via books service: ${booksServiceUrl}/books`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${booksServiceUrl}/books`, bookData, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const createdBook = response.data?.data || response.data;
            this.logger.log(`Book created successfully: ${JSON.stringify(response.data)}`);
            if (staffId) {
                await this.activityLogService.logAction({
                    adminId: staffId,
                    action: 'BOOKSADDED',
                    entityType: 'BOOK',
                    entityId: createdBook._id || createdBook.id || 'unknown',
                    details: {
                        title: createdBook.title,
                        message: `Added new book: ${createdBook.title || bookData.title} (ID: ${createdBook.bookId || createdBook.id || 'unknown'})`,
                        referenceId: createdBook.bookId || createdBook.id || createdBook._id
                    }
                });
            }
            return {
                message: 'Book created successfully',
                data: createdBook,
            };
        }
        catch (error) {
            this.logger.error(`Failed to create book: ${error.message}`);
            this.logger.error(`Error details: ${JSON.stringify(error.response?.data || error)}`);
            throw error;
        }
    }
    async getMyProfile(staffId) {
        return this.staffModel.findById(staffId).select('-password -__v');
    }
    async getMyContribution(staffId) {
        return {
            totalActivities: 0,
            booksAdded: 0,
            booksIssued: 0,
            booksReturned: 0,
        };
    }
    async getMyActivitySummary(staffId) {
        const totalBooksAdded = await this.activityLogService.getLogs(1, 1, { adminId: staffId, action: 'BOOKSADDED' });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysBooksAdded = await this.activityLogService.getLogs(1, 1, {
            adminId: staffId,
            action: 'BOOKSADDED',
            createdAt: { $gte: today }
        });
        const lastActivityQuery = await this.activityLogService.getLogs(1, 1000, {
            adminId: staffId,
            action: { $in: ['BOOKSADDED', 'STAFF_LOGIN', 'STAFF_LOGOUT'] }
        });
        const recentActivities = lastActivityQuery.data.map((log) => {
            let actionName = log.action;
            if (log.action === 'BOOKSADDED')
                actionName = 'ADD BOOK';
            else if (log.action === 'STAFF_LOGIN')
                actionName = 'LOGIN';
            else if (log.action === 'STAFF_LOGOUT')
                actionName = 'LOGOUT';
            return {
                action: actionName,
                date: log.createdAt,
                description: log.details?.message || (actionName === 'LOGIN' ? 'Staff logged in' : actionName === 'LOGOUT' ? 'Staff logged out' : ''),
                referenceId: log.details?.referenceId || log.entityId
            };
        });
        return {
            totalActivitiesBooksAdded: totalBooksAdded.count || 0,
            todaysActivitiesBooksAdded: todaysBooksAdded.count || 0,
            recentActivities: recentActivities,
        };
    }
    async getBooksByCategory() {
        return [];
    }
    async getRackUtilization() {
        return [];
    }
    async getBooksStatusDistribution() {
        return {
            available: 0,
            issued: 0,
            overdue: 0,
            damaged: 0,
        };
    }
    async getTodaysVisitors() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const visits = await this.libraryVisitModel
                .find({
                timeIn: { $gte: today },
            })
                .populate('memberId', 'name email memberId')
                .sort({ timeIn: -1 })
                .exec();
            this.logger.log(`Found ${visits.length} visitors today`);
            return visits;
        }
        catch (error) {
            this.logger.error(`Failed to get today's visitors: ${error.message}`);
            return [];
        }
    }
    async getTodaysIssues(authHeader) {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            this.logger.log(`Fetching today's issues from: ${issuesServiceUrl}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/today`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const issues = response.data?.data || [];
            this.logger.log(`Found ${issues.length} issues today`);
            return issues;
        }
        catch (error) {
            this.logger.error(`Failed to get today's issues: ${error.message}`);
            return [];
        }
    }
};
exports.StaffDashboardService = StaffDashboardService;
exports.StaffDashboardService = StaffDashboardService = StaffDashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __param(1, (0, mongoose_1.InjectModel)(staff_entity_1.Staff.name)),
    __param(2, (0, mongoose_1.InjectModel)(library_visit_entity_1.LibraryVisit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model, typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object, activity_log_service_1.ActivityLogService])
], StaffDashboardService);
//# sourceMappingURL=staff-dashboard.service.js.map