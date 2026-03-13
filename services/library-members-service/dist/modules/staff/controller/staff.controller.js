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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const staff_service_1 = require("../service/staff.service");
const create_staff_dto_1 = require("../dto/create-staff.dto");
const update_staff_dto_1 = require("../dto/update-staff.dto");
const staff_login_dto_1 = require("../dto/staff-login.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let StaffController = class StaffController {
    constructor(staffService) {
        this.staffService = staffService;
    }
    async staffLogin(loginDto) {
        const result = await this.staffService.login(loginDto);
        return { message: 'Login successful', data: result };
    }
    async createStaff(createDto) {
        const result = await this.staffService.create(createDto);
        return { message: 'Staff created successfully', data: result };
    }
    async getAllStaff() {
        const result = await this.staffService.findAll();
        return { message: 'Staff retrieved successfully', data: result, count: result.length };
    }
    async getStaffById(id) {
        const result = await this.staffService.findById(id);
        return { message: 'Staff retrieved successfully', data: result };
    }
    async updateStaff(id, updateDto) {
        const result = await this.staffService.update(id, updateDto);
        return { message: 'Staff updated successfully', data: result };
    }
    async deleteStaff(id) {
        await this.staffService.delete(id);
        return { message: 'Staff deleted successfully' };
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Staff login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_login_dto_1.StaffLoginDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "staffLogin", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new staff' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Staff created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_dto_1.CreateStaffDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all staff' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getAllStaff", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update staff' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_dto_1.UpdateStaffDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete staff' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "deleteStaff", null);
exports.StaffController = StaffController = __decorate([
    (0, swagger_1.ApiTags)('Staff'),
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map