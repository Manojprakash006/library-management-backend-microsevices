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
const public_decorator_1 = require("../../../auth/guards/public.decorator");
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
    async findAll(req, page = '1', limit = '10') {
        const token = req.headers.authorization;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const result = await this.membersService.findAll(token, pageNum, limitNum);
        return {
            message: 'Members retrieved successfully',
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        };
    }
    async getFooterStats(req) {
        const userId = req.user.id;
        const token = req.headers.authorization;
        if (!userId) {
            throw new common_1.BadRequestException('User ID is missing');
        }
        const footerStats = await this.membersService.getMyStats(userId, token);
        return { message: 'Data retrieved successfully', data: footerStats };
    }
    async findOne(id, req) {
        const token = req.headers.authorization;
        const member = await this.membersService.findOne(id, token);
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
    async addBorrowingHistory(id, historyData) {
        await this.membersService.addBorrowingHistory(id, historyData);
        return { message: 'Borrowing history added successfully' };
    }
    async updateBorrowingHistory(id, updateData) {
        const issueId = updateData.issueId;
        await this.membersService.updateBorrowingHistory(id, issueId, updateData);
        return { message: 'Borrowing history updated successfully' };
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
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all members' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)('admin', 'member', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member stats' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "getFooterStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a member by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findOne", null);
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
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a member' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/borrowing-history'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a book to member borrowing history' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "addBorrowingHistory", null);
__decorate([
    (0, common_1.Post)(':id/borrow'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Update member borrowing history (return book)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "updateBorrowingHistory", null);
exports.MembersController = MembersController = __decorate([
    (0, swagger_1.ApiTags)('Members'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('members'),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], MembersController);
//# sourceMappingURL=members.controller.js.map