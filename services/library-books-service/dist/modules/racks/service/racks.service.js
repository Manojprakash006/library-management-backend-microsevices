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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RacksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const book_entity_1 = require("../../books/entities/book.entity");
const config_service_1 = require("../../library-config/service/config.service");
let RacksService = RacksService_1 = class RacksService {
    constructor(bookModel, httpService, configService) {
        this.bookModel = bookModel;
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(RacksService_1.name);
    }
    async findAll() {
        const books = await this.bookModel.find().exec();
        const config = await this.configService.getConfig();
        const maxRackCapacity = config?.maxRackCapacity || 50;
        const maxShelfCapacity = config?.maxShelfCapacity || 10;
        const rackMap = {};
        for (const book of books) {
            const rackNumber = book.rackNumber;
            if (!rackMap[rackNumber]) {
                rackMap[rackNumber] = {
                    rackNumber: rackNumber,
                    location: 'Main Hall',
                    totalBooks: 0,
                    totalQuantity: 0,
                    available: 0,
                    issued: 0,
                    capacity: maxRackCapacity,
                    shelves: {},
                    recentBooks: [],
                    books: [],
                };
            }
            const issuedCount = await this.getIssuedCountForBook(book._id.toString());
            const availableCount = Math.max(0, (book.quantity || 0) - issuedCount);
            rackMap[rackNumber].totalBooks += 1;
            rackMap[rackNumber].totalQuantity += (book.quantity || 0);
            const shelfNumber = book.shelfNumber || 'S1';
            if (!rackMap[rackNumber].shelves[shelfNumber]) {
                rackMap[rackNumber].shelves[shelfNumber] = {
                    shelfNumber,
                    totalBooks: 0,
                    totalQuantity: 0,
                    capacity: maxShelfCapacity,
                };
            }
            rackMap[rackNumber].shelves[shelfNumber].totalBooks += 1;
            rackMap[rackNumber].shelves[shelfNumber].totalQuantity += (book.quantity || 0);
            rackMap[rackNumber].available += availableCount > 0 ? 1 : 0;
            rackMap[rackNumber].issued += issuedCount > 0 ? 1 : 0;
            rackMap[rackNumber].books.push({
                _id: book._id,
                bookId: book.bookId,
                isbn: book.isbn,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                publishYear: book.publishYear,
                category: book.category,
                edition: book.edition,
                language: book.language,
                pages: book.pages,
                price: book.price,
                rackNumber: book.rackNumber,
                shelfNumber: book.shelfNumber,
                bookType: book.bookType,
                condition: book.condition,
                description: book.description,
                quantity: book.quantity,
                available: availableCount,
                issued: issuedCount,
                status: availableCount > 0 ? 'Available' : 'Issued',
                coverUrl: book.coverUrl,
                createdAt: book.createdAt,
                updatedAt: book.updatedAt,
            });
        }
        for (const rackNumber in rackMap) {
            const rack = rackMap[rackNumber];
            rack.recentBooks = rack.books.slice(0, 3).map((b) => ({
                title: b.title,
                status: b.status,
                available: b.available,
                issued: b.issued,
            }));
        }
        return Object.values(rackMap);
    }
    async getIssuedCountForBook(bookId) {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/count/book/${bookId}`));
            return response.data?.count || 0;
        }
        catch (error) {
            this.logger.error(`Failed to fetch issued count for book ${bookId}: ${error.message}`);
            return 0;
        }
    }
    async findByRackNumber(rackNumber) {
        const books = await this.bookModel.find({ rackNumber }).exec();
        const config = await this.configService.getConfig();
        const maxRackCapacity = config?.maxRackCapacity || 50;
        const maxShelfCapacity = config?.maxShelfCapacity || 10;
        if (books.length === 0) {
            throw new common_1.NotFoundException('Rack not found or has no books');
        }
        const rackData = {
            rackNumber: rackNumber,
            location: 'Main Hall',
            totalBooks: books.length,
            totalQuantity: 0,
            available: 0,
            issued: 0,
            capacity: maxRackCapacity,
            shelves: {},
            books: [],
            booksByCategory: {},
            damagedQuantity: 0,
        };
        for (const book of books) {
            const issuedCount = await this.getIssuedCountForBook(book._id.toString());
            const availableCount = Math.max(0, (book.quantity || 0) - issuedCount);
            rackData.totalQuantity += (book.quantity || 0);
            rackData.damagedQuantity += (book.damagedQuantity || 0);
            const shelfNumber = book.shelfNumber || 'S1';
            if (!rackData.shelves[shelfNumber]) {
                rackData.shelves[shelfNumber] = {
                    shelfNumber,
                    totalBooks: 0,
                    totalQuantity: 0,
                    capacity: maxShelfCapacity,
                };
            }
            rackData.shelves[shelfNumber].totalBooks += 1;
            rackData.shelves[shelfNumber].totalQuantity += (book.quantity || 0);
            rackData.available += availableCount > 0 ? 1 : 0;
            rackData.issued += issuedCount > 0 ? 1 : 0;
            const bookData = {
                _id: book._id,
                bookId: book.bookId,
                isbn: book.isbn,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                publishYear: book.publishYear,
                category: book.category,
                edition: book.edition,
                language: book.language,
                pages: book.pages,
                price: book.price,
                rackNumber: book.rackNumber,
                shelfNumber: book.shelfNumber,
                bookType: book.bookType,
                condition: book.condition,
                description: book.description,
                quantity: book.quantity,
                damagedQuantity: book.damagedQuantity || 0,
                available: availableCount,
                issued: issuedCount,
                status: availableCount > 0 ? 'Available' : 'Issued',
                coverUrl: book.coverUrl,
                createdAt: book.createdAt,
                updatedAt: book.updatedAt,
            };
            rackData.books.push(bookData);
            if (!rackData.booksByCategory[book.category]) {
                rackData.booksByCategory[book.category] = [];
            }
            rackData.booksByCategory[book.category].push(bookData);
        }
        rackData.capacityPercentage = ((rackData.totalQuantity / rackData.capacity) * 100).toFixed(0);
        return rackData;
    }
};
exports.RacksService = RacksService;
exports.RacksService = RacksService = RacksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_entity_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object, config_service_1.ConfigService])
], RacksService);
//# sourceMappingURL=racks.service.js.map