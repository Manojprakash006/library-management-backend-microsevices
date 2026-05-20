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
    async getBooksAddedTodayCount(authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/dashboard/books-added-today`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            return response.data?.data || 0;
        }
        catch (error) {
            this.logger.error(`Failed to fetch today's book count: ${error.message}`);
            return 0;
        }
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
                damagedBooks: 0,
                lostBooks: 0,
            };
            this.logger.log(`Parsed stats: ${JSON.stringify(stats)}`);
            const todayBookAdded = await this.getBooksAddedTodayCount(authHeader);
            return {
                totalBooks: stats.totalBooks || 0,
                availableBooks: stats.availableBooks || 0,
                issuedBooks: stats.issuedBooks || 0,
                damagedBooks: stats.damagedBooks || 0,
                lostBooks: stats.lostBooks || 0,
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
                damagedBooks: 0,
                lostBooks: 0,
                todayBookAdded: 0,
            };
        }
    }
    async getBooksAddedTodayList(authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/dashboard/books-added-today/list`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            return response.data?.data || [];
        }
        catch (error) {
            this.logger.error(`Failed to fetch today's books list: ${error.message}`);
            return [];
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
    async getRecentActivities(staffId) {
        try {
            const lastActivityQuery = await this.activityLogService.getLogs(1, 5, {
                adminId: staffId,
                action: { $nin: ['STAFF_LOGIN', 'STAFF_LOGOUT', 'ADMIN_LOGIN'] }
            });
            return lastActivityQuery.data.map((log) => {
                let actionName = log.action;
                if (log.action === 'BOOKSADDED')
                    actionName = 'ADD BOOK';
                else if (log.action === 'REQUEST_APPROVED')
                    actionName = 'APPROVE REQUEST';
                else if (log.action === 'REQUEST_REJECTED')
                    actionName = 'REJECT REQUEST';
                return {
                    _id: log._id,
                    action: actionName,
                    date: log.createdAt,
                    description: log.details?.message || log.details?.title || actionName,
                    referenceId: log.entityName || log.details?.referenceId || log.entityId
                };
            });
        }
        catch (error) {
            this.logger.error(`Failed to fetch recent activities: ${error.message}`);
            return [];
        }
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
        const profile = await this.staffModel.findById(staffId).select('-password -__v').lean();
        if (!profile)
            return null;
        const contributionFilter = {
            adminId: staffId,
            action: { $nin: ['STAFF_LOGIN', 'STAFF_LOGOUT', 'ADMIN_LOGIN'] }
        };
        const totalActivities = await this.activityLogService.getLogs(1, 1, contributionFilter);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysActivities = await this.activityLogService.getLogs(1, 1, {
            ...contributionFilter,
            createdAt: { $gte: today }
        });
        const lastActivity = await this.activityLogService.getLogs(1, 1, { adminId: staffId });
        return {
            ...profile,
            department: profile.department || 'General',
            qualification: profile.qualification || 'N/A',
            address: profile.address || 'N/A',
            emergencyContact: profile.emergencyContact || 'N/A',
            joinDate: profile.createdAt,
            totalActivities: totalActivities.count || 0,
            todaysActivities: todaysActivities.count || 0,
            lastActive: lastActivity.data?.length > 0 ? lastActivity.data[0].createdAt : profile.updatedAt,
            profileImage: profile.profileImage || "",
        };
    }
    async getMyContribution(staffId) {
        const contributionFilter = {
            adminId: staffId,
            action: { $nin: ['STAFF_LOGIN', 'STAFF_LOGOUT', 'ADMIN_LOGIN'] }
        };
        const totalActivities = await this.activityLogService.getLogs(1, 1, contributionFilter);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysActivities = await this.activityLogService.getLogs(1, 1, {
            ...contributionFilter,
            createdAt: { $gte: today }
        });
        return {
            totalActivities: totalActivities.count || 0,
            todaysActivities: todaysActivities.count || 0,
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
                referenceId: log.entityName || log.details?.referenceId || log.entityId
            };
        });
        return {
            totalActivitiesBooksAdded: totalBooksAdded.count || 0,
            todaysActivitiesBooksAdded: todaysBooksAdded.count || 0,
            recentActivities: recentActivities,
        };
    }
    async getBooksByCategory(authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            this.logger.log(`Fetching books by category from: ${booksServiceUrl}/dashboard/inventory`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/dashboard/inventory`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const booksByCategory = response.data?.data?.booksByCategory || [];
            return booksByCategory.map((item) => ({
                category: item._id || 'Unknown',
                count: item.count || 0
            }));
        }
        catch (error) {
            this.logger.error(`Failed to fetch books by category: ${error.message}`);
            return [];
        }
    }
    async getRackUtilization(authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            this.logger.log(`Fetching rack utilization from: ${booksServiceUrl}/racks`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/racks`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const racks = response.data?.data || [];
            return racks.map((rack) => ({
                rackNumber: rack.rackNumber || 'Unknown',
                usedCount: rack.totalBooks || 0,
                totalBooks: rack.totalBooks || 0,
                capacity: rack.capacity || 50,
            }));
        }
        catch (error) {
            this.logger.error(`Failed to fetch rack utilization: ${error.message}`);
            return [];
        }
    }
    async getBooksStatusDistribution(authHeader) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            this.logger.log(`Fetching books status distribution from: ${booksServiceUrl}/dashboard/stat-cards`);
            const statsResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/dashboard/stat-cards`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const stats = statsResponse.data?.data || {};
            return {
                available: stats.availableBooks || stats.availableQuantity || 0,
                issued: stats.issuedBooks || stats.activeIssues || 0,
            };
        }
        catch (error) {
            this.logger.error(`Failed to fetch books status distribution: ${error.message}`);
            return {
                available: 0,
                issued: 0,
            };
        }
    }
    async getTodaysVisitors(authHeader) {
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
            const todaysIssues = await this.getTodaysIssues(authHeader);
            this.logger.log(`Found ${visits.length} explicit visitors and ${todaysIssues.length} issues today`);
            const visitMemberIds = new Set(visits.map(v => v.memberId?._id?.toString() || v.memberId?.toString()));
            const uniqueIssueMembers = new Map();
            todaysIssues.forEach(issue => {
                const memberIdStr = issue.memberId?.toString();
                if (memberIdStr && !visitMemberIds.has(memberIdStr)) {
                    if (!uniqueIssueMembers.has(memberIdStr) || new Date(issue.issueDate) < new Date(uniqueIssueMembers.get(memberIdStr).issueDate)) {
                        uniqueIssueMembers.set(memberIdStr, issue);
                    }
                }
            });
            if (uniqueIssueMembers.size > 0) {
                const additionalMemberIds = Array.from(uniqueIssueMembers.keys());
                const additionalMembers = await this.memberModel.find({
                    _id: { $in: additionalMemberIds }
                }).select('name email memberId').lean();
                const virtualVisits = additionalMembers.map(member => {
                    const issue = uniqueIssueMembers.get(member._id.toString());
                    const isTakingHome = issue.issueType === 'Taking Home';
                    const isReturned = issue.status === 'Returned';
                    return {
                        _id: `auto-${issue._id || issue.issueId}`,
                        memberId: member,
                        timeIn: issue.issueDate,
                        timeOut: isTakingHome ? issue.issueDate : (isReturned ? (issue.returnDate || new Date()) : null),
                        purpose: isTakingHome ? 'issue' : 'reading',
                        isAutoRecorded: true,
                        isActive: !isTakingHome && !isReturned,
                        notes: 'Auto-included from book issue'
                    };
                });
                const allVisitors = [...visits, ...virtualVisits].sort((a, b) => new Date(b.timeIn).getTime() - new Date(a.timeIn).getTime());
                this.logger.log(`Total combined visitors: ${allVisitors.length}`);
                return allVisitors;
            }
            return visits;
        }
        catch (error) {
            this.logger.error(`Failed to get today's visitors: ${error.message}`);
            return [];
        }
    }
    async getTodaysIssues(authHeader) {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issus-service:3013';
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
        mongoose_2.Model,
        axios_1.HttpService,
        activity_log_service_1.ActivityLogService])
], StaffDashboardService);
//# sourceMappingURL=staff-dashboard.service.js.map