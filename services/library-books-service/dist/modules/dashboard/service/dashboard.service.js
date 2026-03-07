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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_entity_1 = require("../../books/entities/book.entity");
let DashboardService = class DashboardService {
    constructor(bookModel) {
        this.bookModel = bookModel;
    }
    async getDashboardStats() {
        const totalBooks = await this.bookModel.countDocuments();
        const availableBooks = await this.bookModel.countDocuments({ status: 'available' });
        const issuedBooks = await this.bookModel.countDocuments({ status: 'issued' });
        return {
            totalBooks,
            availableBooks,
            issuedBooks,
            totalMembers: 0,
            activeIssues: issuedBooks,
            overdueBooks: 0,
        };
    }
    async getInventorySummary() {
        const booksByCategory = await this.bookModel.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        return {
            totalBooks: await this.bookModel.countDocuments(),
            booksByCategory,
        };
    }
    async getPopularBooks() {
        return this.bookModel.find().sort({ borrowCount: -1 }).limit(10).select('-__v');
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_entity_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map