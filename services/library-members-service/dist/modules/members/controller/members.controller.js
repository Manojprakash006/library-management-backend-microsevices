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
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const members_service_1 = require("../service/members.service");
const create_member_dto_1 = require("../dto/create-member.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
let MembersController = class MembersController {
    constructor(membersService) {
        this.membersService = membersService;
    }
    async create(createMemberDto, req) {
        const adminId = req.user?.id || req.user?.userId;
        const member = await this.membersService.create(createMemberDto, adminId);
        return { message: 'Member created successfully', data: member };
    }
    async getActiveCount() {
        const count = await this.membersService.getActiveMembersCount();
        return { data: count };
    }
    async getInactiveCount() {
        const count = await this.membersService.getInactiveMembersCount();
        return { data: count };
    }
    async getCount() {
        const count = await this.membersService.getCount();
        return { data: count };
    }
    async getActiveCount() {
        const count = await this.membersService.getActiveMembersCount();
        return { count };
    }
    async getInactiveCount() {
        const count = await this.membersService.getInactiveMembersCount();
        return { count };
    }
    async findAll() {
        const members = await this.membersService.findAll();
        return { message: 'Members retrieved successfully', data: members, count: members.length };
    }
    async findOne(id) {
        const member = await this.membersService.findOne(id);
        return { message: 'Member retrieved successfully', data: member };
    }
    async findByMemberId(memberId) {
        const member = await this.membersService.findByMemberId(memberId);
        return { message: 'Member retrieved successfully', data: member };
    }
    async update(id, updateData, req) {
        const adminId = req.user?.id || req.user?.userId;
        const member = await this.membersService.update(id, updateData, adminId);
        return { message: 'Member updated successfully', data: member };
    }
    async remove(id, req) {
        const adminId = req.user?.id || req.user?.userId;
        await this.membersService.remove(id, adminId);
        return { message: 'Member deleted successfully' };
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new member' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_member_dto_1.CreateMemberDto, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('stats/active'),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active members count' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "getActiveCount", null);
__decorate([
    (0, common_1.Get)('stats/inactive'),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inactive members count' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "getInactiveCount", null);
__decorate([
    (0, common_1.Get)('stats/total'),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total members count' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "getCount", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('count/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active members count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active members count retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "getActiveCount", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('count/inactive'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inactive members count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inactive members count retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "getInactiveCount", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all members' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a member by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('memberId/:memberId'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a member by Member ID' }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findByMemberId", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a member' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/borrowing-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Add borrowing history entry' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Borrowing history added successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "addBorrowingHistory", null);
__decorate([
    (0, common_1.Put)(':id/borrowing-history/:issueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update borrowing history entry' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Borrowing history updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('issueId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "updateBorrowingHistory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a member' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "remove", null);
exports.MembersController = MembersController = __decorate([
    (0, swagger_1.ApiTags)('Members'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('members'),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], MembersController);
//# sourceMappingURL=members.controller.js.map