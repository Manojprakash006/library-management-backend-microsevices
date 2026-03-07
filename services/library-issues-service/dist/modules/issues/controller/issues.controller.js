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
let IssuesController = class IssuesController {
    constructor(issuesService) {
        this.issuesService = issuesService;
    }
    async create(createIssueDto) {
        const issue = await this.issuesService.create(createIssueDto);
        return { message: 'Book issued successfully', data: issue };
    }
    async findAll() {
        const issues = await this.issuesService.findAll();
        return { message: 'Issued books retrieved successfully', data: issues, count: issues.length };
    }
    async findOne(id) {
        const issue = await this.issuesService.findOne(id);
        return { message: 'Issued book retrieved successfully', data: issue };
    }
    async returnBook(id) {
        const issue = await this.issuesService.returnBook(id);
        return {
            message: 'Book returned successfully',
            data: issue,
            fine: issue.fine > 0 ? { amount: issue.fine, daysOverdue: issue.daysOverdue, finePerDay: issue.finePerDay } : null,
        };
    }
    async remove(id) {
        await this.issuesService.remove(id);
        return { message: 'Issued book record deleted successfully' };
    }
};
exports.IssuesController = IssuesController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Issue a book' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Book issued successfully', type: issue_book_entity_1.IssueBook }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_issue_dto_1.CreateIssueDto]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "create", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all issued books' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issued books retrieved successfully', type: [issue_book_entity_1.IssueBook] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Version)('1'),
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
    (0, common_1.Version)('1'),
    (0, common_1.Put)(':id/return'),
    (0, swagger_1.ApiOperation)({ summary: 'Return a book' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book returned successfully', type: issue_book_entity_1.IssueBook }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Book already returned' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Issued book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "returnBook", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete issued book record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issued book record deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Issued book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IssuesController.prototype, "remove", null);
exports.IssuesController = IssuesController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Issues'),
    (0, common_1.Controller)('issues'),
    __metadata("design:paramtypes", [issues_service_1.IssuesService])
], IssuesController);
//# sourceMappingURL=issues.controller.js.map