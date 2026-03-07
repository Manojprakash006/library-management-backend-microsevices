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
var RacksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RacksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_entity_1 = require("../../books/entities/book.entity");
let RacksService = RacksService_1 = class RacksService {
    constructor(bookModel) {
        this.bookModel = bookModel;
        this.logger = new common_1.Logger(RacksService_1.name);
    }
    async findAll() {
        const books = await this.bookModel.find().exec();
        const rackMap = {};
        for (const book of books) {
            const rackNumber = book.rackNumber;
            if (!rackMap[rackNumber]) {
                rackMap[rackNumber] = {
                    rackNumber: rackNumber,
                    location: 'Main Hall',
                    totalBooks: 0,
                    available: 0,
                    issued: 0,
                    capacity: 50,
                    recentBooks: [],
                    books: [],
                };
            }
            const availableCount = book.quantity || 0;
            const issuedCount = 0;
            rackMap[rackNumber].totalBooks += 1;
            rackMap[rackNumber].available += availableCount > 0 ? 1 : 0;
            rackMap[rackNumber].issued += issuedCount > 0 ? 1 : 0;
            rackMap[rackNumber].books.push({
                _id: book._id,
                bookId: book.bookId,
                title: book.title,
                author: book.author,
                category: book.category,
                shelfNumber: book.shelfNumber,
                quantity: book.quantity,
                available: availableCount,
                issued: issuedCount,
                status: availableCount > 0 ? 'Available' : 'Issued',
                coverUrl: book.coverUrl,
            });
        }
        for (const rackNumber in rackMap) {
            const rack = rackMap[rackNumber];
            rack.recentBooks = rack.books.slice(0, 3).map((b) => ({
                title: b.title,
                status: b.status,
            }));
        }
        return Object.values(rackMap);
    }
    async findByRackNumber(rackNumber) {
        const books = await this.bookModel.find({ rackNumber }).exec();
        if (books.length === 0) {
            throw new common_1.NotFoundException('Rack not found or has no books');
        }
        const rackData = {
            rackNumber: rackNumber,
            location: 'Main Hall',
            totalBooks: books.length,
            available: 0,
            issued: 0,
            capacity: 50,
            books: [],
            booksByCategory: {},
        };
        for (const book of books) {
            const availableCount = book.quantity || 0;
            const issuedCount = 0;
            rackData.available += availableCount > 0 ? 1 : 0;
            rackData.issued += issuedCount > 0 ? 1 : 0;
            const bookData = {
                _id: book._id,
                bookId: book.bookId,
                title: book.title,
                author: book.author,
                category: book.category,
                shelfNumber: book.shelfNumber,
                quantity: book.quantity,
                available: availableCount,
                issued: issuedCount,
                status: availableCount > 0 ? 'Available' : 'Issued',
                coverUrl: book.coverUrl,
            };
            rackData.books.push(bookData);
            if (!rackData.booksByCategory[book.category]) {
                rackData.booksByCategory[book.category] = [];
            }
            rackData.booksByCategory[book.category].push(bookData);
        }
        rackData.capacityPercentage = ((rackData.totalBooks / rackData.capacity) * 100).toFixed(0);
        return rackData;
    }
};
exports.RacksService = RacksService;
exports.RacksService = RacksService = RacksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_entity_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RacksService);
//# sourceMappingURL=racks.service.js.map