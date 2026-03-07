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
exports.DamageReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const damage_reports_service_1 = require("../service/damage-reports.service");
const create_book_damage_report_dto_1 = require("../dto/create-book-damage-report.dto");
const book_damage_report_entity_1 = require("../entities/book-damage-report.entity");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let DamageReportsController = class DamageReportsController {
    constructor(damageReportsService) {
        this.damageReportsService = damageReportsService;
    }
    async create(createBookDamageReportDto) {
        const report = await this.damageReportsService.create(createBookDamageReportDto);
        return { message: 'Damage report created successfully', data: report };
    }
    async findAll(status) {
        const reports = await this.damageReportsService.findAll(status);
        return { message: 'Damage reports retrieved successfully', data: reports, count: reports.length };
    }
    async findOne(id) {
        const report = await this.damageReportsService.findOne(id);
        return { message: 'Damage report retrieved successfully', data: report };
    }
    async approve(id) {
        const report = await this.damageReportsService.approve(id);
        return { message: 'Damage report approved successfully', data: report };
    }
    async reject(id) {
        const report = await this.damageReportsService.reject(id);
        return { message: 'Damage report rejected successfully', data: report };
    }
    async remove(id) {
        await this.damageReportsService.remove(id);
        return { message: 'Damage report deleted successfully' };
    }
};
exports.DamageReportsController = DamageReportsController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new damage report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Damage report created successfully', type: book_damage_report_entity_1.BookDamageReport }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_damage_report_dto_1.CreateBookDamageReportDto]),
    __metadata("design:returntype", Promise)
], DamageReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all damage reports' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Damage reports retrieved successfully', type: [book_damage_report_entity_1.BookDamageReport] }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DamageReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get damage report by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Damage report retrieved successfully', type: book_damage_report_entity_1.BookDamageReport }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Damage report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DamageReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Put)(':id/approve'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve damage report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Damage report approved successfully', type: book_damage_report_entity_1.BookDamageReport }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Damage report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DamageReportsController.prototype, "approve", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Put)(':id/reject'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject damage report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Damage report rejected successfully', type: book_damage_report_entity_1.BookDamageReport }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Damage report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DamageReportsController.prototype, "reject", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete damage report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Damage report deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Damage report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DamageReportsController.prototype, "remove", null);
exports.DamageReportsController = DamageReportsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Damage Reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('damage-reports'),
    __metadata("design:paramtypes", [damage_reports_service_1.DamageReportsService])
], DamageReportsController);
//# sourceMappingURL=damage-reports.controller.js.map