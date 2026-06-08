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
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const book_entity_1 = require("../../books/entities/book.entity");
let ReportsService = ReportsService_1 = class ReportsService {
    constructor(bookModel, httpService) {
        this.bookModel = bookModel;
        this.httpService = httpService;
        this.logger = new common_1.Logger(ReportsService_1.name);
    }
    async getDailyIssueReturnReport() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateStr = today.toISOString().split('T')[0];
        const [booksIssued, booksReturned] = await Promise.all([
            this.getTodayIssuesCount(),
            this.getTodayReturnsCount(),
        ]);
        return {
            date: dateStr,
            booksIssued,
            booksReturned,
        };
    }
    async getOverdueReport() {
        const booksOverdue = await this.getOverdueBooksCount();
        return {
            overdueStatus: booksOverdue > 0 ? 1 : 0,
            booksOverdue,
        };
    }
    async getRackInventoryReport() {
        const books = await this.bookModel.find().exec();
        const rackMap = {};
        const bookIssueCounts = await this.getAllBookIssueCounts();
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
            const bookId = book._id.toString();
            const issuedCount = bookIssueCounts[bookId] || 0;
            const availableCount = Math.max(0, quantity - issuedCount);
            rackMap[rackNumber].total += quantity;
            rackMap[rackNumber].available += availableCount;
            rackMap[rackNumber].issued += issuedCount;
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
        let issued = 0;
        for (const book of books) {
            const quantity = book.quantity || 0;
            const bookId = book._id.toString();
            const issuedCount = await this.getBookIssueCount(bookId);
            const availableCount = Math.max(0, quantity - issuedCount);
            total += quantity;
            available += availableCount;
            issued += issuedCount;
        }
        const capacity = 50;
        const capacityPercentage = Math.round((total / capacity) * 100);
        return {
            rackNumber: rackNumber,
            location: 'Main Hall',
            total: total,
            available: available,
            issued: issued,
            capacityPercentage: capacityPercentage,
        };
    }
    async getMemberActivityReport(authHeader) {
        const [activeMembers, inactiveMembers] = await Promise.all([
            this.getActiveMembersCount(authHeader),
            this.getInactiveMembersCount(authHeader),
        ]);
        return {
            activeMembers,
            inactiveMembers,
        };
    }
    async getAllReports(authHeader) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [dailyIssueReturn, overdue, rackInventory, memberActivity] = await Promise.all([
            this.getDailyIssueReturnReport(),
            this.getOverdueReport(),
            this.getRackInventoryReport(),
            this.getMemberActivityReport(authHeader),
        ]);
        return {
            dailyIssueReturn,
            overdue,
            rackInventory,
            memberActivity,
        };
    }
    async getTodayIssuesCount() {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
            const today = new Date().toISOString().split('T')[0];
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/count?date=${today}`));
            return response.data?.count || 0;
        }
        catch (error) {
            this.logger.error(`Failed to get today issues count: ${error.message}`);
            return 0;
        }
    }
    async getTodayReturnsCount() {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
            const today = new Date().toISOString().split('T')[0];
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/returns/count?date=${today}`));
            return response.data?.count || 0;
        }
        catch (error) {
            this.logger.error(`Failed to get today returns count: ${error.message}`);
            return 0;
        }
    }
    async getOverdueBooksCount() {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/overdue/count`));
            return response.data?.count || 0;
        }
        catch (error) {
            this.logger.error(`Failed to get overdue books count: ${error.message}`);
            return 0;
        }
    }
    async getBookIssueCount(bookId) {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/count/book/${bookId}`));
            return response.data?.count || 0;
        }
        catch (error) {
            this.logger.error(`Failed to get book issue count for ${bookId}: ${error.message}`);
            return 0;
        }
    }
    async getAllBookIssueCounts() {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues`));
            const issues = response.data?.data || [];
            const counts = {};
            for (const issue of issues) {
                if (issue.status !== 'Returned') {
                    const bookId = issue.bookId?.toString() || issue.bookId;
                    counts[bookId] = (counts[bookId] || 0) + 1;
                }
            }
            return counts;
        }
        catch (error) {
            this.logger.error(`Failed to get all book issue counts: ${error.message}`);
            return {};
        }
    }
    async getActiveMembersCount(authHeader) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${membersServiceUrl}/members/stats/active`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            return response.data?.data || 0;
        }
        catch (error) {
            this.logger.error(`Failed to get active members count: ${error.message}`);
            return 0;
        }
    }
    async getInactiveMembersCount(authHeader) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${membersServiceUrl}/members/stats/inactive`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            return response.data?.data || 0;
        }
        catch (error) {
            this.logger.error(`Failed to get inactive members count: ${error.message}`);
            return 0;
        }
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_entity_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map