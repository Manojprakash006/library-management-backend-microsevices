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
exports.IssuesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const issues_service_1 = require("../service/issues.service");
const create_issue_dto_1 = require("../dto/create-issue.dto");
const issue_book_entity_1 = require("../entities/issue-book.entity");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const public_decorator_1 = require("../../../auth/guards/public.decorator");
let IssuesController = class IssuesController {
    constructor(issuesService) {
        this.issuesService = issuesService;
    }
    async create(createIssueDto, req) {
        const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
        const issue = await this.issuesService.create(createIssueDto, adminId);
        return { message: 'Book issued successfully', data: issue };
    }
    async findAll() {
        const issues = await this.issuesService.findAll();
        return { message: 'Issued books retrieved successfully', data: issues, count: issues.length };
    }
    async getMemberStats(memberId) {
        const issues = await this.issuesService.findActiveByMember(memberId);
        const booksAtHome = issues.filter(issue => issue.issueType === 'Taking Home').length;
        const readingInsideLibrary = issues.filter(issue => issue.issueType === 'Reading Inside Library').length;
        return {
            message: 'Member stats retrieved successfully',
            data: {
                booksAtHome,
                readingInsideLibrary,
                totalActive: issues.length
            }
        };
    }
    async findIssuedByMember(memberId) {
        const issues = await this.issuesService.findByMember(memberId);
        return { message: 'Issued books retrieved successfully', data: issues, count: issues.length };
    }
    async findRecent(limit) {
        const recentIssues = await this.issuesService.findRecent(parseInt(limit) || 5);
        return { message: 'Recent issued books retrieved successfully', issues: recentIssues };
    }
    async getOverdueCount() {
        const count = await this.issuesService.getOverdueCount();
        return { count };
    }
    async getIssuesCount(date) {
        const count = await this.issuesService.getIssuesCount(date);
        return { count };
    }
    async getReturnsCount(date) {
        const count = await this.issuesService.getReturnsCount(date);
        return { count };
    }
    async getBookIssueCount(bookId) {
        const count = await this.issuesService.getBookIssueCount(bookId);
        return { count };
    }
    async findOverdue() {
        const issues = await this.issuesService.findAll();
        const overdueIssues = issues.filter(issue => issue.status === 'Overdue');
        return { message: 'Overdue books retrieved successfully', data: overdueIssues, count: overdueIssues.length };
    }
    async findOne(id) {
        const issue = await this.issuesService.findOne(id);
        return { message: 'Issued book retrieved successfully', data: issue };
    }
    async update(id, updateIssueDto, req) {
        const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
        const issue = await this.issuesService.update(id, updateIssueDto, adminId);
        return { message: 'Issued book updated successfully', data: issue };
    }
    async returnBook(id, req) {
        const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
        const issue = await this.issuesService.returnBook(id, adminId);
        return {
            message: 'Book returned successfully',
            data: issue,
            fine: issue.fine > 0 ? { amount: issue.fine, daysOverdue: issue.daysOverdue, finePerDay: issue.finePerDay } : null,
        };
    }
    async remove(id, req) {
        const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
        await this.issuesService.remove(id, adminId);
        return { message: 'Issued book record deleted successfully' };
    }
};
exports.IssuesController = IssuesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Issue a book' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Book issued successfully', type: issue_book_entity_1.IssueBook }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_issue_dto_1.CreateIssueDto, Object]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all issued books' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issued books retrieved successfully', type: [issue_book_entity_1.IssueBook] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('member/:memberId/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member issue stats by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member stats retrieved successfully' }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "getMemberStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('member/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get issued books by member ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issued books retrieved successfully', type: [issue_book_entity_1.IssueBook] }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "findIssuedByMember", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent issued books' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent issued books retrieved successfully', type: [issue_book_entity_1.IssueBook] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "findRecent", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('overdue/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get count of overdue books' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overdue count retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "getOverdueCount", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get count of issues by date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issue count retrieved successfully' }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "getIssuesCount", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('returns/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get count of returned books' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns count retrieved successfully' }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "getReturnsCount", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('count/book/:bookId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get count of active issues for a specific book' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book issue count retrieved successfully' }),
    __param(0, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "getBookIssueCount", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue issued books' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overdue books retrieved successfully', type: [issue_book_entity_1.IssueBook] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "findOverdue", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get issued book by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issued book retrieved successfully', type: issue_book_entity_1.IssueBook }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Issued book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update issued book' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issued book updated successfully', type: issue_book_entity_1.IssueBook }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Issued book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/return'),
    (0, swagger_1.ApiOperation)({ summary: 'Return a book' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book returned successfully', type: issue_book_entity_1.IssueBook }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Book already returned' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Issued book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "returnBook", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete issued book record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issued book record deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Issued book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "remove", null);
exports.IssuesController = IssuesController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiTags)('Issues'),
    (0, common_1.Controller)('issues'),
    __metadata("design:paramtypes", [issues_service_1.IssuesService])
], IssuesController);
//# sourceMappingURL=issues.controller.js.map