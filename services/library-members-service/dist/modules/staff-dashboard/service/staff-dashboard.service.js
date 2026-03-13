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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffDashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const member_entity_1 = require("../../members/entities/member.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const activity_log_entity_1 = require("../../activity-logs/entities/activity-log.entity");
let StaffDashboardService = class StaffDashboardService {
    constructor(memberModel, staffModel, activityLogModel) {
        this.memberModel = memberModel;
        this.staffModel = staffModel;
        this.activityLogModel = activityLogModel;
    }
    async getStaffStats() {
        return {
            totalMembers: await this.memberModel.countDocuments(),
            totalBooks: 0,
            booksIssued: 0,
            booksReturned: 0,
            overdueBooks: 0,
            pendingRequests: 0,
        };
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
    async getBooksAddedToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [];
    }
    async getRecentActivities() {
        return this.activityLogModel.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .select('-__v');
    }
    async getRackDistribution() {
        return [];
    }
    async createBook(bookData) {
        return { message: 'Book created', data: bookData };
    }
    async getMyActivityLogs(staffId) {
        return this.activityLogModel.find({ userId: staffId })
            .sort({ timestamp: -1 })
            .limit(50)
            .select('-__v');
    }
    async getMyProfile(staffId) {
        return this.staffModel.findById(staffId).select('-password -__v');
    }
    async getMyContribution(staffId) {
        const logs = await this.activityLogModel.countDocuments({ userId: staffId });
        return {
            totalActivities: logs,
            booksAdded: 0,
            booksIssued: 0,
            booksReturned: 0,
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
};
exports.StaffDashboardService = StaffDashboardService;
exports.StaffDashboardService = StaffDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __param(1, (0, mongoose_1.InjectModel)(staff_entity_1.Staff.name)),
    __param(2, (0, mongoose_1.InjectModel)(activity_log_entity_1.ActivityLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], StaffDashboardService);
//# sourceMappingURL=staff-dashboard.service.js.map