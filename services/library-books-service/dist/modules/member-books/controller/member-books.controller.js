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
exports.MemberBooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const member_books_service_1 = require("../service/member-books.service");
const request_book_dto_1 = require("../dto/request-book.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let MemberBooksController = class MemberBooksController {
    constructor(memberBooksService) {
        this.memberBooksService = memberBooksService;
    }
    async getAllBooks() {
        const result = await this.memberBooksService.getAllBooks();
        return { message: 'Books retrieved successfully', data: result, count: result.length };
    }
    async getBookById(bookId) {
        const result = await this.memberBooksService.getBookById(bookId);
        return { message: 'Book retrieved successfully', data: result };
    }
    async requestBook(requestDto) {
        const result = await this.memberBooksService.requestBook(requestDto);
        return { message: 'Book requested successfully', data: result };
    }
};
exports.MemberBooksController = MemberBooksController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('browse'),
    (0, swagger_1.ApiOperation)({ summary: 'Browse all available books' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberBooksController.prototype, "getAllBooks", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(':bookId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get book by ID' }),
    __param(0, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberBooksController.prototype, "getBookById", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('request'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a book' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_book_dto_1.RequestBookDto]),
    __metadata("design:returntype", Promise)
], MemberBooksController.prototype, "requestBook", null);
exports.MemberBooksController = MemberBooksController = __decorate([
    (0, swagger_1.ApiTags)('Member Books'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('member'),
    (0, common_1.Controller)('member-books'),
    __metadata("design:paramtypes", [member_books_service_1.MemberBooksService])
], MemberBooksController);
//# sourceMappingURL=member-books.controller.js.map