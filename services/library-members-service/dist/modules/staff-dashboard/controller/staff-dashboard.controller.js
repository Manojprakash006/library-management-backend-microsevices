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
};
exports.StaffDashboardController = StaffDashboardController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff dashboard stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getStaffStats", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('recent-issues'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent book issues' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getRecentIssues", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('overdue-books'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all overdue books' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getOverdueBooks", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('pending-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending book requests' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffDashboardController.prototype, "getPendingRequests", null);
exports.StaffDashboardController = StaffDashboardController = __decorate([
    (0, swagger_1.ApiTags)('Staff Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('staff-dashboard'),
    __metadata("design:paramtypes", [staff_dashboard_service_1.StaffDashboardService])
], StaffDashboardController);
//# sourceMappingURL=staff-dashboard.controller.js.map