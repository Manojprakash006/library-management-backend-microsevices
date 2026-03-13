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
exports.BooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const books_service_1 = require("../service/books.service");
const create_book_dto_1 = require("../dto/create-book.dto");
const update_book_dto_1 = require("../dto/update-book.dto");
const create_book_review_dto_1 = require("../dto/create-book-review.dto");
const book_entity_1 = require("../entities/book.entity");
const book_review_entity_1 = require("../entities/book-review.entity");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const public_decorator_1 = require("../../../auth/guards/public.decorator");
let BooksController = class BooksController {
    constructor(booksService) {
        this.booksService = booksService;
    }
    async create(createBookDto) {
        const book = await this.booksService.create(createBookDto);
        return { message: 'Book created successfully', data: book };
    }
    async findAll() {
        const books = await this.booksService.findAll();
        return { message: 'Books retrieved successfully', data: books, count: books.length };
    }
    async search(query) {
        const books = await this.booksService.search(query);
        return { message: 'Search results', data: books, count: books.length };
    }
    async findByCategory(category) {
        const books = await this.booksService.findByCategory(category);
        return { message: 'Books by category retrieved successfully', data: books, count: books.length };
    }
    async findOne(id) {
        const book = await this.booksService.findOne(id);
        return { message: 'Book retrieved successfully', data: book };
    }
    async update(id, updateBookDto) {
        const book = await this.booksService.update(id, updateBookDto);
        return { message: 'Book updated successfully', data: book };
    }
    async updateStatus(id, status) {
        const book = await this.booksService.updateStatus(id, status);
        return { message: 'Book status updated successfully', data: book };
    }
    async remove(id) {
        await this.booksService.remove(id);
        return { message: 'Book deleted successfully' };
    }
    async createReview(createReviewDto) {
        const review = await this.booksService.createReview(createReviewDto);
        return { message: 'Review created successfully', data: review };
    }
    async findReviewsByBook(bookId) {
        const reviews = await this.booksService.findReviewsByBook(bookId);
        return { message: 'Reviews retrieved successfully', data: reviews, count: reviews.length };
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new book' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Book created successfully', type: book_entity_1.Book }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Book ID already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_dto_1.CreateBookDto]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all books' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Books retrieved successfully', type: [book_entity_1.Book] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search books by text' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results', type: [book_entity_1.Book] }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get books by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Books by category', type: [book_entity_1.Book] }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get book by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book retrieved successfully', type: book_entity_1.Book }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update book' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book updated successfully', type: book_entity_1.Book }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_book_dto_1.UpdateBookDto]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update book status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book status updated successfully', type: book_entity_1.Book }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete book' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a book review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review created successfully', type: book_review_entity_1.BookReview }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Review already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_review_dto_1.CreateBookReviewDto]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('reviews/:bookId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reviews by book ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reviews retrieved successfully', type: [book_review_entity_1.BookReview] }),
    __param(0, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "findReviewsByBook", null);
exports.BooksController = BooksController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiTags)('Books'),
    (0, common_1.Controller)('books'),
    __metadata("design:paramtypes", [books_service_1.BooksService])
], BooksController);
//# sourceMappingURL=books.controller.js.map