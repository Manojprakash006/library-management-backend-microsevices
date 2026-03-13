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
exports.RenewalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const renewals_service_1 = require("../service/renewals.service");
const create_book_renewal_dto_1 = require("../dto/create-book-renewal.dto");
const book_renewal_entity_1 = require("../entities/book-renewal.entity");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let RenewalsController = class RenewalsController {
    constructor(renewalsService) {
        this.renewalsService = renewalsService;
    }
    async create(createBookRenewalDto) {
        const renewal = await this.renewalsService.create(createBookRenewalDto);
        return { message: 'Renewal request created successfully', data: renewal };
    }
    async findAll(status) {
        const renewals = await this.renewalsService.findAll(status);
        return { message: 'Renewal requests retrieved successfully', data: renewals, count: renewals.length };
    }
    async findOne(id) {
        const renewal = await this.renewalsService.findOne(id);
        return { message: 'Renewal request retrieved successfully', data: renewal };
    }
    async approve(id) {
        const renewal = await this.renewalsService.approve(id);
        return { message: 'Renewal approved successfully', data: renewal };
    }
    async reject(id) {
        const renewal = await this.renewalsService.reject(id);
        return { message: 'Renewal rejected successfully', data: renewal };
    }
    async remove(id) {
        await this.renewalsService.remove(id);
        return { message: 'Renewal request deleted successfully' };
    }
};
exports.RenewalsController = RenewalsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new renewal request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Renewal request created successfully', type: book_renewal_entity_1.BookRenewal }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_renewal_dto_1.CreateBookRenewalDto]),
    __metadata("design:returntype", Promise)
], RenewalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all renewal requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Renewal requests retrieved successfully', type: [book_renewal_entity_1.BookRenewal] }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RenewalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get renewal request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Renewal request retrieved successfully', type: book_renewal_entity_1.BookRenewal }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Renewal request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RenewalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve renewal request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Renewal approved successfully', type: book_renewal_entity_1.BookRenewal }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Renewal request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RenewalsController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject renewal request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Renewal rejected successfully', type: book_renewal_entity_1.BookRenewal }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Renewal request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RenewalsController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete renewal request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Renewal request deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Renewal request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RenewalsController.prototype, "remove", null);
exports.RenewalsController = RenewalsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Renewals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('renewals'),
    __metadata("design:paramtypes", [renewals_service_1.RenewalsService])
], RenewalsController);
//# sourceMappingURL=renewals.controller.js.map