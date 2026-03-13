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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("../service/dashboard.service");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getDashboardStats() {
        const result = await this.dashboardService.getDashboardStats();
        return { message: 'Dashboard stats retrieved', data: result };
    }
    async getInventorySummary() {
        const result = await this.dashboardService.getInventorySummary();
        return { message: 'Inventory summary retrieved', data: result };
    }
    async getPopularBooks() {
        const result = await this.dashboardService.getPopularBooks();
        return { message: 'Popular books retrieved', data: result };
    }
    async getStatCards() {
        const result = await this.dashboardService.getStatCards();
        return { message: 'Stat cards retrieved', data: result };
    }
    async getRecentBooks(req) {
        const authHeader = req.headers['authorization'];
        const result = await this.dashboardService.getRecentBooks(authHeader);
        return { message: 'Recent books retrieved', data: result };
    }
    async getOverdueBooks(req) {
        const authHeader = req.headers['authorization'];
        const result = await this.dashboardService.getOverdueBooks(authHeader);
        return { message: 'Overdue books retrieved', data: result };
    }
    async getPendingRequests(req) {
        const authHeader = req.headers['authorization'];
        const result = await this.dashboardService.getPendingRequests(authHeader);
        return { message: 'Pending requests retrieved', data: result };
    }
    async getPending(req) {
        const authHeader = req.headers['authorization'];
        const result = await this.dashboardService.getPendingRequests(authHeader);
        return { message: 'Pending requests retrieved', data: result };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getInventorySummary", null);
__decorate([
    (0, common_1.Get)('popular-books'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular books' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPopularBooks", null);
__decorate([
    (0, common_1.Get)('stat-cards'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stat cards data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStatCards", null);
__decorate([
    (0, common_1.Get)('recent-books'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent books' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRecentBooks", null);
__decorate([
    (0, common_1.Get)('overdue-books'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue books' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getOverdueBooks", null);
__decorate([
    (0, common_1.Get)('pending-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending requests' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending requests (alias)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPending", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map