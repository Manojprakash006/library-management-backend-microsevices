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
    async getCollectionStats() {
        const stats = await this.booksService.getCollectionStats();
        return { message: 'Collection stats retrieved successfully', data: stats };
    }
    async getTopReviews() {
        const reviews = await this.booksService.getTopReviews();
        return { message: 'Top reviews retrieved successfully', data: reviews };
    }
    async create(createBookDto, req) {
        const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
        const role = req.user?.role;
        const book = await this.booksService.create(createBookDto, adminId, role);
        return { message: 'Book created successfully', data: book };
    }
    async findAll(page = '1', limit = '10') {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const result = await this.booksService.findAll(pageNum, limitNum);
        return {
            message: 'Books retrieved successfully',
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        };
    }
    async search(query) {
        const books = await this.booksService.search(query);
        return { message: 'Search results', data: books, count: books.length };
    }
    async findByCategory(category) {
        const books = await this.booksService.findByCategory(category);
        return { message: 'Books by category retrieved successfully', data: books, count: books.length };
    }
    async findAllCategories() {
        const categories = await this.booksService.findAllCategories();
        return { message: 'Categories retrieved successfully', data: categories };
    }
    async checkReview(bookId, memberId) {
        return this.booksService.checkReview(bookId, memberId);
    }
    async findOne(id) {
        const book = await this.booksService.findOne(id);
        return { message: 'Book retrieved successfully', data: book };
    }
    async findCopies(id) {
        const copies = await this.booksService.findCopiesByTitleId(id);
        return { message: 'Book copies retrieved successfully', data: copies };
    }
    async getReviewsByBook(bookId) {
        const reviews = await this.booksService.findReviewsByBook(bookId);
        return {
            message: 'Reviews fetched successfully',
            data: reviews,
        };
    }
    toggleLike(reviewId, req) {
        const userId = req.user?.id || req.user?.userId;
        if (!userId) {
            throw new Error("User not Authenticated");
        }
        return this.booksService.toggleLike(reviewId, userId);
    }
    async update(id, updateBookDto, req) {
        const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
        const book = await this.booksService.update(id, updateBookDto, adminId);
        return { message: 'Book updated successfully', data: book };
    }
    async updateStatus(id, status) {
        const book = await this.booksService.updateStatus(id, status);
        return { message: 'Book status updated successfully', data: book };
    }
    async updateCopyStatus(copyNumber, status, condition) {
        const copy = await this.booksService.updateCopyStatus(copyNumber, status, condition);
        return { message: 'Book copy status updated successfully', data: copy };
    }
    async updateConditionQuantity(id, condition, change) {
        const book = await this.booksService.updateConditionQuantity(id, condition, change);
        return { message: 'Book condition quantity updated successfully', data: book };
    }
    async remove(id, req) {
        const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
        await this.booksService.remove(id, adminId);
        return { message: 'Book deleted successfully' };
    }
    async createReview(createReviewDto, req) {
        const user = req.user;
        const token = req.headers.authorization;
        const review = await this.booksService.createReview({
            ...createReviewDto,
            memberId: user.id,
        }, token);
        return { message: 'Review created successfully', data: review };
    }
    async getMyReviews(userId) {
        const reviews = await this.booksService.findReviewsByUser(userId);
        return {
            message: 'My reviews fetched',
            data: reviews,
        };
    }
    async updateReview(reviewId, updateData, req) {
        const userId = req.user?.id;
        const updated = await this.booksService.updateReview(reviewId, userId, updateData);
        return {
            message: 'Review updated successfully',
            data: updated,
        };
    }
    async deleteReview(reviewId, req) {
        const userId = req.user?.id || req.user?.userId;
        const role = req.user?.role;
        try {
            await this.booksService.deleteReview(reviewId, userId, role);
            return {
                message: 'Review deleted successfully',
            };
        }
        catch (error) {
            if (error.message === 'Review not found') {
                throw new common_1.NotFoundException(error.message);
            }
            throw new common_1.ForbiddenException(error.message);
        }
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public/collection-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get book collection stats for landing page' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getCollectionStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public/top-reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top book reviews for landing page' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getTopReviews", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new book' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Book created successfully', type: book_entity_1.Book }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Book ID already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_dto_1.CreateBookDto, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all books' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Books retrieved successfully', type: [book_entity_1.Book] }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
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
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all unique book categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "findAllCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/check'),
    __param(0, (0, common_1.Query)('bookId')),
    __param(1, (0, common_1.Query)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "checkReview", null);
__decorate([
    (0, public_decorator_1.Public)(),
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
    (0, common_1.Get)(':id/copies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all copies of a book' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "findCopies", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':bookId/reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reviews by book ID' }),
    __param(0, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getReviewsByBook", null);
__decorate([
    (0, common_1.Post)(':reviewId/like'),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update book' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book updated successfully', type: book_entity_1.Book }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_book_dto_1.UpdateBookDto, Object]),
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
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)('copies/:copyNumber/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update book copy status' }),
    __param(0, (0, common_1.Param)('copyNumber')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('condition')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "updateCopyStatus", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':id/condition-quantity'),
    (0, swagger_1.ApiOperation)({ summary: 'Update book damaged/lost quantities' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('condition')),
    __param(2, (0, common_1.Body)('change')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "updateConditionQuantity", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete book' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Book not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a book review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review created successfully', type: book_review_entity_1.BookReview }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Review already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_review_dto_1.CreateBookReviewDto, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('my-reviews/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getMyReviews", null);
__decorate([
    (0, common_1.Put)('reviews/:reviewId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a book review' }),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "updateReview", null);
__decorate([
    (0, common_1.Delete)('reviews/:reviewId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a book review' }),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "deleteReview", null);
exports.BooksController = BooksController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiTags)('Books'),
    (0, common_1.Controller)('books'),
    __metadata("design:paramtypes", [books_service_1.BooksService])
], BooksController);
//# sourceMappingURL=books.controller.js.map