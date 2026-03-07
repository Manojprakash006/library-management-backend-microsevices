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
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_entity_1 = require("../../books/entities/book.entity");
let ReportsService = ReportsService_1 = class ReportsService {
    constructor(bookModel) {
        this.bookModel = bookModel;
        this.logger = new common_1.Logger(ReportsService_1.name);
    }
    async getDailyIssueReturnReport() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return {
            date: today.toISOString().split('T')[0],
            booksIssued: 0,
            booksReturned: 0,
        };
    }
    async getOverdueReport() {
        return {
            overdueStatus: 0,
            booksOverdue: 0,
        };
    }
    async getRackInventoryReport() {
        const books = await this.bookModel.find().exec();
        const rackMap = {};
        for (const book of books) {
            const rackNumber = book.rackNumber;
            if (!rackMap[rackNumber]) {
                rackMap[rackNumber] = {
                    rackNumber: rackNumber,
                    location: 'Main Hall',
                    total: 0,
                    available: 0,
                    issued: 0,
                    capacityPercentage: 0,
                };
            }
            const quantity = book.quantity || 0;
            rackMap[rackNumber].total += quantity;
            rackMap[rackNumber].available += quantity;
        }
        for (const rackNumber in rackMap) {
            const rack = rackMap[rackNumber];
            const capacity = 50;
            rack.capacityPercentage = Math.round((rack.total / capacity) * 100);
        }
        return Object.values(rackMap);
    }
    async getRackInventoryById(rackNumber) {
        const books = await this.bookModel.find({ rackNumber }).exec();
        if (books.length === 0) {
            throw new common_1.NotFoundException('Rack not found or has no books');
        }
        let total = 0;
        let available = 0;
        for (const book of books) {
            const quantity = book.quantity || 0;
            total += quantity;
            available += quantity;
        }
        const capacity = 50;
        const capacityPercentage = Math.round((total / capacity) * 100);
        return {
            rackNumber: rackNumber,
            location: 'Main Hall',
            total: total,
            available: available,
            issued: 0,
            capacityPercentage: capacityPercentage,
        };
    }
    async getMemberActivityReport() {
        return {
            activeMembers: 0,
            inactiveMembers: 0,
        };
    }
    async getAllReports() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const rackInventory = await this.getRackInventoryReport();
        return {
            dailyIssueReturn: {
                date: today.toISOString().split('T')[0],
                booksIssued: 0,
                booksReturned: 0,
            },
            overdue: {
                overdueStatus: 0,
                booksOverdue: 0,
            },
            rackInventory: rackInventory,
            memberActivity: {
                activeMembers: 0,
                inactiveMembers: 0,
            },
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_entity_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map