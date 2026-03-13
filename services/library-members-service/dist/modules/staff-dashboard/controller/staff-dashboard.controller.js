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
exports.StaffDashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const staff_dashboard_service_1 = require("../service/staff-dashboard.service");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let StaffDashboardController = class StaffDashboardController {
    constructor(staffDashboardService) {
        this.staffDashboardService = staffDashboardService;
    }
    async getStaffStats() {
        const result = await this.staffDashboardService.getStaffStats();
        return { message: 'Stats retrieved successfully', data: result };
    }
    async getRecentIssues() {
        const result = await this.staffDashboardService.getRecentIssues();
        return { message: 'Recent issues retrieved', data: result };
    }
    async getOverdueBooks() {
        const result = await this.staffDashboardService.getOverdueBooks();
        return { message: 'Overdue books retrieved', data: result };
    }
    async getPendingRequests() {
        const result = await this.staffDashboardService.getPendingRequests();
        return { message: 'Pending requests retrieved', data: result };
    }
    async getStaffStatCards() {
        const result = await this.staffDashboardService.getStatCards();
        return { message: 'Stat cards retrieved successfully', data: result };
    }
    async getBooksAddedToday() {
        const result = await this.staffDashboardService.getBooksAddedToday();
        return { message: 'Books added today retrieved', data: result };
    }
    async getRecentActivities() {
        const result = await this.staffDashboardService.getRecentActivities();
        return { message: 'Recent activities retrieved', data: result };
    }
    async getRackDistribution() {
        const result = await this.staffDashboardService.getRackDistribution();
        return { message: 'Rack distribution retrieved', data: result };
    }
    async createBook(bookData) {
        const result = await this.staffDashboardService.createBook(bookData);
        return { message: 'Book created successfully', data: result };
    }
    async getMyActivityLogs(req) {
        const result = await this.staffDashboardService.getMyActivityLogs(req.user.userId);
        return { message: 'Activity logs retrieved', data: result };
    }
    async getMyProfile(req) {
        const result = await this.staffDashboardService.getMyProfile(req.user.userId);
        return { message: 'Profile retrieved', data: result };
    }
    async getMyContribution(req) {
        const result = await this.staffDashboardService.getMyContribution(req.user.userId);
        return { message: 'Contribution data retrieved', data: result };
    }
    async getBooksByCategory() {
        const result = await this.staffDashboardService.getBooksByCategory();
        return { message: 'Books by category retrieved', data: result };
    }
    async getRackUtilization() {
        const result = await this.staffDashboardService.getRackUtilization();
        return { message: 'Rack utilization retrieved', data: result };
    }
    async getBooksStatusDistribution() {
        const result = await this.staffDashboardService.getBooksStatusDistribution();
        return { message: 'Books status distribution retrieved', data: result };
    }
};
exports.StaffDashboardController = StaffDashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff dashboard stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getStaffStats", null);
__decorate([
    (0, common_1.Get)('recent-issues'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent book issues' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getRecentIssues", null);
__decorate([
    (0, common_1.Get)('overdue-books'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all overdue books' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getOverdueBooks", null);
__decorate([
    (0, common_1.Get)('pending-requests'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending book requests' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('stat-cards'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff stat cards' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getStaffStatCards", null);
__decorate([
    (0, common_1.Get)('books-added-today'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get books added today' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getBooksAddedToday", null);
__decorate([
    (0, common_1.Get)('recent-activities'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent activities' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getRecentActivities", null);
__decorate([
    (0, common_1.Get)('rack-distribution'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rack distribution' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getRackDistribution", null);
__decorate([
    (0, common_1.Post)('books'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new book' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "createBook", null);
__decorate([
    (0, common_1.Get)('my-activity-logs'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my activity logs' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getMyActivityLogs", null);
__decorate([
    (0, common_1.Get)('my-profile'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)('my-contribution'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my contribution' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getMyContribution", null);
__decorate([
    (0, common_1.Get)('books-by-category'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get books by category' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getBooksByCategory", null);
__decorate([
    (0, common_1.Get)('rack-utilization'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rack utilization' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getRackUtilization", null);
__decorate([
    (0, common_1.Get)('books-status-distribution'),
    (0, roles_decorator_1.Roles)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get books status distribution' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getBooksStatusDistribution", null);
exports.StaffDashboardController = StaffDashboardController = __decorate([
    (0, swagger_1.ApiTags)('Staff Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('staff-dashboard'),
    __metadata("design:paramtypes", [staff_dashboard_service_1.StaffDashboardService])
], StaffDashboardController);
//# sourceMappingURL=staff-dashboard.controller.js.map