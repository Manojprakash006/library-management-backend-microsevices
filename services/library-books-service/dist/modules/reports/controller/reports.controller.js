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