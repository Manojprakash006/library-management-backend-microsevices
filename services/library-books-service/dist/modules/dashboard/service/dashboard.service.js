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
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const book_entity_1 = require("../../books/entities/book.entity");
const book_request_entity_1 = require("../../book-requests/entities/book-request.entity");
let DashboardService = class DashboardService {
    constructor(bookModel, bookRequestModel, httpService) {
        this.bookModel = bookModel;
        this.bookRequestModel = bookRequestModel;
        this.httpService = httpService;
    }
    async getDashboardStats() {
        const totalBooks = await this.bookModel.countDocuments();
        const availableBooks = await this.bookModel.countDocuments({ status: 'available' });
        const issuedBooks = await this.bookModel.countDocuments({ status: 'issued' });
        const pendingRequests = await this.bookRequestModel.countDocuments({ status: 'Pending' });
        const overdueBooks = await this.getOverdueBooksCount();
        const totalMembers = await this.getTotalMembersCount();
        const newArrivals = await this.getNewArrivalsCount();
        const todayIssues = await this.getTodayIssuesCount();
        return {
            totalBooks,
            availableBooks,
            issuedBooks,
            totalMembers,
            activeIssues: issuedBooks,
            overdueBooks,
            pendingRequests,
            newArrivals,
            todayIssues,
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
    async getStatCards() {
        const totalBooks = await this.bookModel.countDocuments();
        const availableBooks = await this.bookModel.countDocuments({ quantity: { $gt: 0 } });
        const activeIssues = await this.getActiveIssuesCount();
        const issuedBooks = activeIssues;
        const pendingRequests = await this.getPendingRequestsCount();
        const overdueBooks = await this.getOverdueBooksCount();
        const totalMembers = await this.getTotalMembersCount();
        const newArrivals = await this.getNewArrivalsCount();
        const todayIssues = await this.getTodayIssuesCount();
        return {
            totalBooks,
            availableBooks,
            issuedBooks,
            overdueBooks,
            totalMembers,
            newArrivals,
            pendingRequests,
            todayIssues,
        };
    }
    async getRecentBooks(authHeader) {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/recent?limit=5`));
            const issues = response.data?.issues || [];
            if (issues.length === 0)
                return [];
            const populatedIssues = await Promise.all(issues.map(async (issue) => {
                const [book, member] = await Promise.all([
                    this.fetchBookDetails(issue.bookId),
                    this.fetchMemberDetails(issue.memberId, authHeader),
                ]);
                return {
                    _id: issue._id,
                    book,
                    member,
                    issueType: issue.issueType,
                    numberOfDays: issue.numberOfDays,
                    issueDate: issue.issueDate,
                    dueDate: issue.dueDate,
                    returnDate: issue.returnDate,
                    status: issue.status,
                    daysOverdue: issue.daysOverdue,
                    fine: issue.fine,
                    finePerDay: issue.finePerDay,
                    createdAt: issue.createdAt,
                    updatedAt: issue.updatedAt,
                };
            }));
            return populatedIssues;
        }
        catch (error) {
            return [];
        }
    }
    async fetchBookDetails(bookId) {
        try {
            const book = await this.bookModel.findById(bookId)
                .select('title author isbn category rackNumber shelfNumber quantity')
                .lean();
            if (book) {
                return {
                    _id: book._id.toString(),
                    bookId: book._id.toString(),
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn,
                    category: book.category,
                    rackNumber: book.rackNumber,
                    shelfNumber: book.shelfNumber,
                    location: `Rack ${book.rackNumber}${book.shelfNumber ? ', Shelf ' + book.shelfNumber : ''}`,
                    status: book.quantity > 0 ? 'Available' : 'Not Available',
                };
            }
        }
        catch (error) {
        }
        return {
            _id: bookId,
            bookId: 'N/A',
            title: 'Unknown Book',
            author: 'Unknown',
            isbn: 'N/A',
            category: 'N/A',
            rackNumber: 'N/A',
            shelfNumber: 'N/A',
            location: 'N/A',
            status: 'Unknown',
        };
    }
    async fetchMemberDetails(memberId, authHeader) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${membersServiceUrl}/members/${memberId}`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            if (response.data?.data) {
                const member = response.data.data;
                const borrowingHistory = member.borrowingHistory || [];
                const activeBooks = borrowingHistory.filter(h => h.status === 'borrowed').length;
                return {
                    _id: member._id,
                    memberId: member.memberId,
                    name: member.name,
                    email: member.email,
                    phone: member.phoneNumber,
                    address: member.address,
                    memberSince: member.membershipDate,
                    currentlyBorrowed: activeBooks,
                    totalHistory: borrowingHistory.length,
                    borrowingStatus: {
                        currentlyBorrowed: activeBooks,
                        activeBooks: activeBooks,
                        totalHistory: borrowingHistory.length,
                    },
                };
            }
        }
        catch (error) {
        }
        return {
            _id: memberId,
            memberId: 'N/A',
            name: 'Unknown Member',
            email: 'N/A',
            phone: 'N/A',
            address: 'N/A',
            memberSince: null,
            currentlyBorrowed: 0,
            totalHistory: 0,
            borrowingStatus: {
                currentlyBorrowed: 0,
                activeBooks: 0,
                totalHistory: 0,
            },
        };
    }
    async getOverdueBooks(authHeader) {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/overdue`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const issues = response.data?.data || [];
            if (issues.length === 0)
                return [];
            const populatedIssues = await Promise.all(issues.map(async (issue) => {
                const [book, member] = await Promise.all([
                    this.fetchBookDetails(issue.bookId),
                    this.fetchMemberDetails(issue.memberId, authHeader),
                ]);
                return {
                    _id: issue._id,
                    book,
                    member,
                    issueType: issue.issueType,
                    numberOfDays: issue.numberOfDays,
                    issueDate: issue.issueDate,
                    dueDate: issue.dueDate,
                    returnDate: issue.returnDate,
                    status: issue.status,
                    daysOverdue: issue.daysOverdue,
                    fine: issue.fine,
                    finePerDay: issue.finePerDay,
                    createdAt: issue.createdAt,
                    updatedAt: issue.updatedAt,
                };
            }));
            return populatedIssues;
        }
        catch (error) {
            return [];
        }
    }
    async getPendingRequests(authHeader) {
        try {
            const requestsServiceUrl = process.env.REQUESTS_SERVICE_URL || 'http://localhost:3014';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${requestsServiceUrl}/requests`, {
                headers: authHeader ? { Authorization: authHeader } : undefined,
            }));
            const pendingRequests = response.data?.data?.filter(req => req.status === 'Pending') || [];
            const populatedRequests = await Promise.all(pendingRequests.map(async (req) => {
                const [book, member] = await Promise.all([
                    this.fetchBookDetails(req.bookId),
                    this.fetchMemberDetails(req.memberId, authHeader),
                ]);
                return {
                    ...req,
                    book,
                    member,
                };
            }));
            return populatedRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
        }
        catch (error) {
            return [];
        }
    }
    async getActiveIssuesCount() {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/count`));
            return response.data?.count || 0;
        }
        catch (error) {
            return 0;
        }
    }
    async getPendingRequestsCount() {
        try {
            const requestsServiceUrl = process.env.REQUESTS_SERVICE_URL || 'http://localhost:3014';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${requestsServiceUrl}/requests`));
            const requests = response.data?.data || [];
            return requests.filter(req => req.status === 'Pending' || req.status === 'PENDING').length;
        }
        catch (error) {
            return 0;
        }
    }
    async getOverdueBooksCount() {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/overdue/count`));
            return response.data?.count || 0;
        }
        catch (error) {
            return 0;
        }
    }
    async getTotalMembersCount() {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${membersServiceUrl}/members/count`));
            return response.data?.count || 0;
        }
        catch (error) {
            return 0;
        }
    }
    async getNewArrivalsCount() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return this.bookModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    }
    async getTodayIssuesCount() {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
            const today = new Date().toISOString().split('T')[0];
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/count?date=${today}`));
            return response.data?.count || 0;
        }
        catch (error) {
            return 0;
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_entity_1.Book.name)),
    __param(1, (0, mongoose_1.InjectModel)(book_request_entity_1.BookRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        axios_1.HttpService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map