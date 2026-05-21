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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("../service/reports.service");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getOverviewReport(req, filterType, startDate, endDate) {
        const authHeader = req.headers['authorization'];
        const data = await this.reportsService.getOverviewReport(authHeader, filterType, startDate, endDate);
        return { message: 'Overview report retrieved successfully', data };
    }
    async getStaffReport(req, filterType, startDate, endDate) {
        const authHeader = req.headers['authorization'];
        const data = await this.reportsService.getStaffReport(authHeader, filterType, startDate, endDate);
        return { message: 'Staff report retrieved successfully', data };
    }
    async getBooksReport(req, filterType, startDate, endDate) {
        const authHeader = req.headers['authorization'];
        const data = await this.reportsService.getBooksReport(authHeader, filterType, startDate, endDate);
        return { message: 'Book report retrieved successfully', data };
    }
    async getMembersReport(req, filterType, startDate, endDate) {
        const authHeader = req.headers['authorization'];
        const data = await this.reportsService.getMembersReport(authHeader, filterType, startDate, endDate);
        return { message: 'Member report retrieved successfully', data };
    }
    async getPaymentsReport(req, filterType, startDate, endDate) {
        const authHeader = req.headers['authorization'];
        const data = await this.reportsService.getPaymentsReport(authHeader, filterType, startDate, endDate);
        return { message: 'Payment report retrieved successfully', data };
    }
    async getRequestsReport(req, filterType, startDate, endDate) {
        const authHeader = req.headers['authorization'];
        const data = await this.reportsService.getRequestsReport(authHeader, filterType, startDate, endDate);
        return { message: 'Requests report retrieved successfully', data };
    }
    async getReviewsReport(req, filterType, startDate, endDate) {
        const authHeader = req.headers['authorization'];
        const data = await this.reportsService.getReviewsReport(authHeader, filterType, startDate, endDate);
        return { message: 'Reviews report retrieved successfully', data };
    }
    async getAllReports(req) {
        const authHeader = req.headers['authorization'];
        const reports = await this.reportsService.getAllReports(authHeader);
        return { message: 'All reports retrieved successfully', data: reports };
    }
    async getDailyIssueReturnReport() {
        const report = await this.reportsService.getDailyIssueReturnReport();
        return { message: 'Daily issue and return report retrieved successfully', data: report };
    }
    async getOverdueReport() {
        const report = await this.reportsService.getOverdueReport();
        return { message: 'Overdue report retrieved successfully', data: report };
    }
    async getRackInventoryReport() {
        const report = await this.reportsService.getRackInventoryReport();
        const totalBooks = report.reduce((sum, rack) => sum + rack.total, 0);
        return { message: 'Rack inventory report retrieved successfully', data: report, count: totalBooks };
    }
    async getRackInventoryById(rackNumber) {
        const report = await this.reportsService.getRackInventoryById(rackNumber);
        return { message: 'Rack inventory details retrieved successfully', data: report };
    }
    async getMemberActivityReport(req) {
        const authHeader = req.headers['authorization'];
        const report = await this.reportsService.getMemberActivityReport(authHeader);
        return { message: 'Member activity report retrieved successfully', data: report };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overview dashboard report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overview report retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('filterType')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getOverviewReport", null);
__decorate([
    (0, common_1.Get)('staff'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff performance report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff report retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('filterType')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStaffReport", null);
__decorate([
    (0, common_1.Get)('books'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get book performance report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book report retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('filterType')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getBooksReport", null);
__decorate([
    (0, common_1.Get)('members'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member engagement report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member report retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('filterType')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMembersReport", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment financial report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment report retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('filterType')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPaymentsReport", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get book requests and trends report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Requests report retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('filterType')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getRequestsReport", null);
__decorate([
    (0, common_1.Get)('reviews'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get book reviews report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reviews report retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('filterType')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReviewsReport", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reports summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All reports retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAllReports", null);
__decorate([
    (0, common_1.Get)('daily-issue-return'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily issue and return report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daily issue and return report retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDailyIssueReturnReport", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue books report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overdue report retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getOverdueReport", null);
__decorate([
    (0, common_1.Get)('rack-inventory'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rack inventory report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rack inventory report retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getRackInventoryReport", null);
__decorate([
    (0, common_1.Get)('rack-inventory/:rackNumber'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rack inventory by rack number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rack inventory details retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rack not found' }),
    __param(0, (0, common_1.Param)('rackNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getRackInventoryById", null);
__decorate([
    (0, common_1.Get)('member-activity'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member activity report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member activity report retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMemberActivityReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map