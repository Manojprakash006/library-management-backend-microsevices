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
exports.MemberHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const member_history_service_1 = require("../service/member-history.service");
const create_review_dto_1 = require("../dto/create-review.dto");
const update_review_dto_1 = require("../dto/update-review.dto");
const request_book_again_dto_1 = require("../dto/request-book-again.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let MemberHistoryController = class MemberHistoryController {
    constructor(memberHistoryService) {
        this.memberHistoryService = memberHistoryService;
    }
    async getMemberHistory(req) {
        const result = await this.memberHistoryService.getMemberHistory(req.user.userId);
        return { message: 'History retrieved successfully', data: result };
    }
    async requestBookAgain(req, requestDto) {
        const result = await this.memberHistoryService.requestBookAgain(req.user.userId, requestDto);
        return { message: 'Book request submitted', data: result };
    }
    async getMemberReviews(req) {
        const result = await this.memberHistoryService.getMemberReviews(req.user.userId);
        return { message: 'Reviews retrieved successfully', data: result };
    }
    async createReview(req, reviewDto) {
        const result = await this.memberHistoryService.createReview(req.user.userId, reviewDto);
        return { message: 'Review created successfully', data: result };
    }
    async updateReview(id, reviewDto) {
        const result = await this.memberHistoryService.updateReview(id, reviewDto);
        return { message: 'Review updated successfully', data: result };
    }
    async deleteReview(id) {
        await this.memberHistoryService.deleteReview(id);
        return { message: 'Review deleted successfully' };
    }
};
exports.MemberHistoryController = MemberHistoryController;
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member borrowing history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'History retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberHistoryController.prototype, "getMemberHistory", null);
__decorate([
    (0, common_1.Post)('request-again'),
    (0, swagger_1.ApiOperation)({ summary: 'Request book again' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Book request submitted' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_book_again_dto_1.RequestBookAgainDto]),
    __metadata("design:returntype", Promise)
], MemberHistoryController.prototype, "requestBookAgain", null);
__decorate([
    (0, common_1.Get)('reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member reviews' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reviews retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberHistoryController.prototype, "getMemberReviews", null);
__decorate([
    (0, common_1.Post)('reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], MemberHistoryController.prototype, "createReview", null);
__decorate([
    (0, common_1.Put)('reviews/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_review_dto_1.UpdateReviewDto]),
    __metadata("design:returntype", Promise)
], MemberHistoryController.prototype, "updateReview", null);
__decorate([
    (0, common_1.Delete)('reviews/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberHistoryController.prototype, "deleteReview", null);
exports.MemberHistoryController = MemberHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Member History'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('member'),
    (0, common_1.Controller)('member-history'),
    __metadata("design:paramtypes", [member_history_service_1.MemberHistoryService])
], MemberHistoryController);
//# sourceMappingURL=member-history.controller.js.map