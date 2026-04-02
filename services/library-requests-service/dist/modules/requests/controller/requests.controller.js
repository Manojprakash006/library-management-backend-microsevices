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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const requests_service_1 = require("../service/requests.service");
const create_book_request_dto_1 = require("../dto/create-book-request.dto");
const book_request_entity_1 = require("../entities/book-request.entity");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const public_decorator_1 = require("../../../auth/guards/public.decorator");
let RequestsController = class RequestsController {
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    async create(createDto, req) {
        const request = await this.requestsService.create(createDto);
        return { message: 'Book request created successfully', data: request };
    }
    async findAll() {
        const requests = await this.requestsService.findAll();
        return { message: 'Book requests retrieved successfully', data: requests, count: requests.length };
    }
    async getPendingCount() {
        const count = await this.requestsService.getPendingCount();
        return { count };
    }
    async getRequestsByMember(memberId) {
        const requests = await this.requestsService.getByMember(memberId);
        return { data: requests };
    }
    async findOne(id) {
        const request = await this.requestsService.findOne(id);
        return { message: 'Book request retrieved successfully', data: request };
    }
    async update(id, updateDto) {
        const request = await this.requestsService.update(id, updateDto);
        return { message: 'Book request updated successfully', data: request };
    }
    async cancel(id, req) {
        const memberId = req.user.id;
        const request = await this.requestsService.cancel(id, memberId);
        return { message: 'Book request cancelled successfully', data: request };
    }
    async approve(id, req) {
        const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
        const request = await this.requestsService.approve(id, adminId);
        return { message: 'Book request approved successfully', data: request };
    }
    async reject(id, req) {
        const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
        const request = await this.requestsService.reject(id, adminId);
        return { message: 'Book request rejected successfully', data: request };
    }
    async remove(id) {
        await this.requestsService.remove(id);
        return { message: 'Book request deleted successfully' };
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new book request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Book request created successfully', type: book_request_entity_1.BookRequest }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_request_dto_1.CreateBookRequestDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all book requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book requests retrieved successfully', type: [book_request_entity_1.BookRequest] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('count/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get count of pending requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending requests count retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getPendingCount", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('member/:memberId'),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getRequestsByMember", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get book request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request retrieved successfully', type: book_request_entity_1.BookRequest }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update book request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request updated successfully', type: book_request_entity_1.BookRequest }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel book request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request cancelled successfully', type: book_request_entity_1.BookRequest }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "cancel", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Put)(':id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a book request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request approved successfully', type: book_request_entity_1.BookRequest }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "approve", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Put)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a book request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request rejected successfully', type: book_request_entity_1.BookRequest }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "reject", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete book request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "remove", null);
exports.RequestsController = RequestsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)('Book Requests'),
    (0, common_1.Controller)('requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map