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
exports.MemberDashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const member_dashboard_service_1 = require("../service/member-dashboard.service");
const report_damage_dto_1 = require("../dto/report-damage.dto");
const renew_book_dto_1 = require("../dto/renew-book.dto");
const submit_review_dto_1 = require("../dto/submit-review.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let MemberDashboardController = class MemberDashboardController {
    constructor(memberDashboardService) {
        this.memberDashboardService = memberDashboardService;
    }
    async getMemberStats(req) {
        const result = await this.memberDashboardService.getMemberStats(req.user.userId);
        return { message: 'Stats retrieved successfully', data: result };
    }
    async getOverdueBooks(req) {
        const result = await this.memberDashboardService.getOverdueBooks(req.user.userId);
        return { message: 'Overdue books retrieved', data: result };
    }
    async getRecentRequests(req) {
        const result = await this.memberDashboardService.getRecentRequests(req.user.userId);
        return { message: 'Recent requests retrieved', data: result };
    }
    async getCurrentlyBorrowedBooks(req) {
        const result = await this.memberDashboardService.getCurrentlyBorrowedBooks(req.user.userId);
        return { message: 'Borrowed books retrieved', data: result };
    }
    async getBookDetails(issueId) {
        const result = await this.memberDashboardService.getBookDetails(issueId);
        return { message: 'Book details retrieved', data: result };
    }
    async getMyBooks(req) {
        const result = await this.memberDashboardService.getMyBooks(req.user.userId);
        return { message: 'My books retrieved', data: result };
    }
    async reportBookDamage(damageDto) {
        const result = await this.memberDashboardService.reportBookDamage(damageDto);
        return { message: 'Damage report submitted', data: result };
    }
    async renewBook(renewDto) {
        const result = await this.memberDashboardService.renewBook(renewDto);
        return { message: 'Book renewal requested', data: result };
    }
    async submitReview(req, reviewDto) {
        const result = await this.memberDashboardService.submitReview(req.user.userId, reviewDto);
        return { message: 'Review submitted', data: result };
    }
};
exports.MemberDashboardController = MemberDashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member dashboard stats' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberDashboardController.prototype, "getMemberStats", null);
__decorate([
    (0, common_1.Get)('overdue-books'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue books' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberDashboardController.prototype, "getOverdueBooks", null);
__decorate([
    (0, common_1.Get)('recent-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent book requests' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberDashboardController.prototype, "getRecentRequests", null);
__decorate([
    (0, common_1.Get)('borrowed-books'),
    (0, swagger_1.ApiOperation)({ summary: 'Get currently borrowed books' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberDashboardController.prototype, "getCurrentlyBorrowedBooks", null);
__decorate([
    (0, common_1.Get)('book-details/:issueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get book details by issue ID' }),
    __param(0, (0, common_1.Param)('issueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberDashboardController.prototype, "getBookDetails", null);
__decorate([
    (0, common_1.Get)('my-books'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my books' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberDashboardController.prototype, "getMyBooks", null);
__decorate([
    (0, common_1.Post)('report-damage'),
    (0, swagger_1.ApiOperation)({ summary: 'Report book damage' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_damage_dto_1.ReportDamageDto]),
    __metadata("design:returntype", Promise)
], MemberDashboardController.prototype, "reportBookDamage", null);
__decorate([
    (0, common_1.Post)('renew-book'),
    (0, swagger_1.ApiOperation)({ summary: 'Renew a book' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [renew_book_dto_1.RenewBookDto]),
    __metadata("design:returntype", Promise)
], MemberDashboardController.prototype, "renewBook", null);
__decorate([
    (0, common_1.Post)('submit-review'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a book review' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, submit_review_dto_1.SubmitReviewDto]),
    __metadata("design:returntype", Promise)
], MemberDashboardController.prototype, "submitReview", null);
exports.MemberDashboardController = MemberDashboardController = __decorate([
    (0, swagger_1.ApiTags)('Member Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('member'),
    (0, common_1.Controller)('member-dashboard'),
    __metadata("design:paramtypes", [member_dashboard_service_1.MemberDashboardService])
], MemberDashboardController);
//# sourceMappingURL=member-dashboard.controller.js.map