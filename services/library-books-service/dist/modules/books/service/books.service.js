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
var BooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_entity_1 = require("../entities/book.entity");
const book_review_entity_1 = require("../entities/book-review.entity");
let BooksService = BooksService_1 = class BooksService {
    constructor(bookModel, bookReviewModel) {
        this.bookModel = bookModel;
        this.bookReviewModel = bookReviewModel;
        this.logger = new common_1.Logger(BooksService_1.name);
    }
    async create(createBookDto) {
        const existingBook = await this.bookModel.findOne({ bookId: createBookDto.bookId }).exec();
        if (existingBook) {
            throw new common_1.ConflictException('Book ID already exists');
        }
        const createdBook = new this.bookModel(createBookDto);
        return createdBook.save();
    }
    async findAll() {
        return this.bookModel.find().exec();
    }
    async findOne(id) {
        const book = await this.bookModel.findById(id).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        return book;
    }
    async findByBookId(bookId) {
        const book = await this.bookModel.findOne({ bookId }).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        return book;
    }
    async update(id, updateBookDto) {
        const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        return book;
    }
    async updateStatus(id, status) {
        const book = await this.bookModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        this.logger.log(`Book ${id} status updated to ${status}`);
        return book;
    }
    async remove(id) {
        const result = await this.bookModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Book not found');
        }
    }
    async search(query) {
        return this.bookModel.find({ $text: { $search: query } }).exec();
    }
    async findByCategory(category) {
        return this.bookModel.find({ category }).exec();
    }
    async findByRack(rackNumber) {
        return this.bookModel.find({ rackNumber }).exec();
    }
    async createReview(createReviewDto) {
        const existingReview = await this.bookReviewModel.findOne({
            bookId: new mongoose_2.Types.ObjectId(createReviewDto.bookId),
            memberId: new mongoose_2.Types.ObjectId(createReviewDto.memberId),
        }).exec();
        if (existingReview) {
            throw new common_1.ConflictException('Review already exists for this book by this member');
        }
        const review = new this.bookReviewModel({
            ...createReviewDto,
            bookId: new mongoose_2.Types.ObjectId(createReviewDto.bookId),
            memberId: new mongoose_2.Types.ObjectId(createReviewDto.memberId),
        });
        return review.save();
    }
    async findReviewsByBook(bookId) {
        return this.bookReviewModel.find({ bookId: new mongoose_2.Types.ObjectId(bookId) }).exec();
    }
    async findReviewsByMember(memberId) {
        return this.bookReviewModel.find({ memberId: new mongoose_2.Types.ObjectId(memberId) }).sort({ reviewDate: -1 }).exec();
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = BooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_entity_1.Book.name)),
    __param(1, (0, mongoose_1.InjectModel)(book_review_entity_1.BookReview.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], BooksService);
//# sourceMappingURL=books.service.js.map