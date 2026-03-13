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
exports.BookRequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const book_requests_service_1 = require("../service/book-requests.service");
const create_book_request_dto_1 = require("../dto/create-book-request.dto");
const book_request_entity_1 = require("../entities/book-request.entity");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let BookRequestsController = class BookRequestsController {
    constructor(bookRequestsService) {
        this.bookRequestsService = bookRequestsService;
    }
    async create(createBookRequestDto) {
        const bookRequest = await this.bookRequestsService.create(createBookRequestDto);
        return { message: 'Book request created successfully', data: bookRequest };
    }
    async findAll() {
        const bookRequests = await this.bookRequestsService.findAll();
        const validRequests = bookRequests.filter((req) => req.bookId && req.memberId);
        return {
            message: 'Book requests retrieved successfully',
            data: validRequests,
            count: validRequests.length,
        };
    }
    async getMemberRequests(req) {
        const memberId = req.user.id;
        const bookRequests = await this.bookRequestsService.findByMember(memberId);
        return {
            message: 'Member book requests retrieved successfully',
            data: bookRequests,
            count: bookRequests.length,
        };
    }
    async findOne(id) {
        const bookRequest = await this.bookRequestsService.findOne(id);
        return { message: 'Book request retrieved successfully', data: bookRequest };
    }
    async update(id, updateBookRequestDto) {
        const bookRequest = await this.bookRequestsService.update(id, updateBookRequestDto);
        return { message: 'Book request updated successfully', data: bookRequest };
    }
    async remove(id) {
        await this.bookRequestsService.remove(id);
        return { message: 'Book request deleted successfully' };
    }
    async cancel(id, req) {
        const memberId = req.user.id;
        await this.bookRequestsService.cancel(id, memberId);
        return { message: 'Book request cancelled successfully' };
    }
    async approve(id) {
        const bookRequest = await this.bookRequestsService.approve(id);
        return { message: 'Book request approved successfully', data: bookRequest };
    }
    async reject(id) {
        const bookRequest = await this.bookRequestsService.reject(id);
        return { message: 'Book request rejected successfully', data: bookRequest };
    }
};
exports.BookRequestsController = BookRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new book request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Book request created successfully', type: book_request_entity_1.BookRequest }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book or Member not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Request ID already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_request_dto_1.CreateBookRequestDto]),
    __metadata("design:returntype", Promise)
], BookRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all book requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book requests retrieved successfully', type: [book_request_entity_1.BookRequest] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookRequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('member/my-requests'),
    (0, roles_decorator_1.Roles)('member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member book requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member book requests retrieved successfully', type: [book_request_entity_1.BookRequest] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookRequestsController.prototype, "getMemberRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get book request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request retrieved successfully', type: book_request_entity_1.BookRequest }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update book request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request updated successfully', type: book_request_entity_1.BookRequest }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_book_request_dto_1.UpdateBookRequestDto]),
    __metadata("design:returntype", Promise)
], BookRequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete book request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookRequestsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, roles_decorator_1.Roles)('member'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel book request (Member only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized to cancel this request' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only pending requests can be cancelled' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookRequestsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve book request (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request approved successfully', type: book_request_entity_1.BookRequest }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book request not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only pending requests can be approved' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookRequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject book request (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book request rejected successfully', type: book_request_entity_1.BookRequest }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book request not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only pending requests can be rejected' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookRequestsController.prototype, "reject", null);
exports.BookRequestsController = BookRequestsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Book Requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('book-requests'),
    __metadata("design:paramtypes", [book_requests_service_1.BookRequestsService])
], BookRequestsController);
//# sourceMappingURL=book-requests.controller.js.map