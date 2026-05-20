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
exports.MemberDashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const member_entity_1 = require("../../members/entities/member.entity");
const book_request_entity_1 = require("../shared/book-request.entity");
const issue_book_entity_1 = require("../shared/issue-book.entity");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
let MemberDashboardService = class MemberDashboardService {
    constructor(memberModel, httpService, issueModel, requestModel) {
        this.memberModel = memberModel;
        this.httpService = httpService;
        this.issueModel = issueModel;
        this.requestModel = requestModel;
    }
    async getMemberStatsFromIssues(memberId) {
        try {
            const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';
            const statsResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/member/${memberId}/stats`));
            const stats = statsResponse.data?.data || { booksAtHome: 0, readingInsideLibrary: 0, totalActive: 0 };
            const allIssuesResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/member/${memberId}`));
            const allIssues = allIssuesResponse.data?.data || [];
            const today = new Date();
            const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const overDueBooks = allIssues.filter((issue) => {
                return issue.status === "Overdue";
            });
            const totalFines = overDueBooks.reduce((sum, issue) => {
                const due = new Date(issue.dueDate);
                const today = new Date();
                const days = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)) || 0;
                return sum + (days > 0 ? days * 10 : 0);
            }, 0);
            const takingHome = allIssues.filter((issue) => issue.issueType === "Taking Home" && issue.status !== "Returned").length;
            const inLibrary = allIssues.filter((issue) => issue.issueType === "Reading Inside Library" && issue.status !== "Returned").length;
            return {
                booksHeld: stats.totalActive,
                booksAtHome: stats.booksAtHome,
                readingInsideLibrary: stats.readingInsideLibrary,
                totalFines,
                overdueCount: overDueBooks.length,
                takingHome,
                inLibrary,
            };
        }
        catch (error) {
            this.logger.error(`Failed to fetch member stats from issues service: ${error.message}`);
            return {
                booksHeld: 0,
                booksAtHome: 0,
                readingInsideLibrary: 0,
                totalFines: 0,
                overdueCount: 0,
                takingHome: 0,
                inLibrary: 0,
            };
        }
    }
    async getDashboardStats(userId) {
        const member = await this.memberModel.findById(userId).exec();
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        let booksHeld = 0;
        let readingInsideLibrary = 0;
        let totalFines = 0;
        let pendingRequests = 0;
        let takingHome = 0;
        let inLibrary = 0;
        try {
            const requestServiceUrl = "http://library-api-gateway:3000/library/requests";
            const url = `${requestServiceUrl}/requests/member/${userId}`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            const requests = response.data?.data || [];
            pendingRequests = requests.filter((req) => req.status === "Pending").length;
        }
        catch (e) {
            console.log("REQUEST SERVICE FAILED :", e.message);
        }
        let overdueBooks = 0;
        try {
            const stats = await this.getMemberStatsFromIssues(userId);
            booksHeld = stats.booksHeld;
            readingInsideLibrary = stats.readingInsideLibrary;
            totalFines = stats.totalFines;
            overdueBooks = stats.overdueCount;
            takingHome = stats.takingHome;
            inLibrary = stats.inLibrary;
        }
        catch (e) {
            console.log("ISSUE SERVICE FAILED :", e);
        }
        try {
            const paymentsServiceUrl = process.env.PAYMENTS_SERVICE_URL || 'http://library-api-gateway:3000/library/payments';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${paymentsServiceUrl}/fines/member/${userId}/pending-check`));
            totalFines += response.data?.data?.totalPendingAmount || 0;
        }
        catch (e) {
            console.log("PAYMENTS SERVICE FAILED :", e.message);
        }
        return {
            issuedBooks: booksHeld,
            pendingRequests,
            activeReservations: readingInsideLibrary,
            overdueBooks,
            totalFines,
            takingHome,
            inLibrary,
        };
    }
    async getOverdueBooks(userId) {
        const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/member/${userId}`));
        const allIssues = response.data?.data || [];
        const today = new Date();
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const overDueBooks = allIssues.filter((issue) => {
            if (issue.issueType !== "Taking Home" || !issue.dueDate)
                return false;
            const today = new Date();
            const due = new Date(issue.dueDate);
            const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const dueOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
            return (issue.status !== "Returned" &&
                dueOnly < todayOnly);
        });
        return overDueBooks.map((issue) => {
            return {
                _id: issue._id,
                bookId: issue.book,
                bookRequestId: issue._id,
                dueDate: issue.dueDate,
                overDue: issue.daysOverdue || 0,
                status: issue.status,
                issueType: issue.issueType,
                issueDate: issue.issueDate,
                issueId: issue.issueId,
            };
        });
    }
    async getRecentRequests(userId) {
        try {
            const requestServiceUrl = "http://library-api-gateway:3000/library/requests";
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${requestServiceUrl}/requests/member/${userId}`));
            const requests = response.data?.data || [];
            return requests?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        catch (error) {
            console.log("FAILED TO FETCH RECENT REQUESTS:", error.message);
            return [];
        }
    }
    async getCurrentlyBorrowedBooks(userId) {
        try {
            const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/member/${userId}/active`));
            return response.data?.data || [];
        }
        catch (error) {
            console.log('FAILED TO FETCH BORROWED BOOKS:', error.message);
            return [];
        }
    }
    async getBookDetails(issueId) {
        const issue = await this.issueModel
            .findById(issueId)
            .populate('bookId')
            .lean();
        if (!issue) {
            throw new Error('Issue not found');
        }
        return issue;
    }
    async getMyBooks(userId) {
        try {
            const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/member/${userId}`));
            const issues = response.data?.data || [];
            issues.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
            return issues.map((issue) => {
                const today = new Date();
                const daysOverdue = issue.dueDate ? Math.max(0, Math.ceil((today.getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;
                return {
                    _id: issue._id,
                    bookId: issue.book,
                    dueDate: issue.dueDate,
                    issueDate: issue.issueDate,
                    status: issue.status,
                    issueType: issue.issueType,
                    damageReported: issue.damageReported,
                    damageNote: issue.damageNote,
                    daysOverdue,
                    renewCount: issue.renewCount || 0,
                    issueId: issue.issueId,
                    returnDate: issue.returnDate,
                    reviewed: issue.reviewed,
                };
            });
        }
        catch (error) {
            console.log("FAILED TO FETCH MY BOOKS:", error.message);
            return [];
        }
    }
    async reportBookDamage(damageDto) {
        await this.issueModel.findByIdAndUpdate(damageDto.bookId, {
            damageReported: true,
            damageNote: damageDto.description,
        });
        return {
            message: 'Damage reported successfully',
            issueId: damageDto.bookId,
        };
    }
    async renewBook(renewDto, authHeader) {
        const requestServiceURL = process.env.REQUEST_SERVICE_URL ||
            'http://library-requests-service:3014';
        try {
            const issueServiceURL = process.env.ISSUE_SERVICE_URL ||
                'http://library-issues-service:3013';
            const issueResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issueServiceURL}/issues/${renewDto.issueId}`, {
                headers: {
                    Authorization: authHeader,
                },
            }));
            const issue = issueResponse.data?.data;
            const requestPayload = {
                memberId: issue.memberId,
                bookId: issue.bookId,
                issueId: renewDto.issueId,
                requestType: 'RENEW',
                reason: renewDto.reason,
            };
            if (renewDto.renewDays) {
                requestPayload.renewDays = renewDto.renewDays;
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${requestServiceURL}/requests`, requestPayload, {
                headers: {
                    Authorization: authHeader,
                },
            }));
            return response.data;
        }
        catch (error) {
            console.log('RENEW ERROR :', error.response?.data);
            throw new common_1.BadRequestException(error.response?.data?.message || 'Renew request failed');
        }
    }
    async submitReview(userId, reviewDto) {
        return {
            message: 'Review submitted',
            userId,
            ...reviewDto,
        };
    }
    async getMyReviews(userId, token) {
        try {
            const bookServiceUrl = 'http://library-api-gateway:3000/library/books';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${bookServiceUrl}/books/my-reviews/${userId}`, {
                headers: {
                    Authorization: token,
                },
            }));
            return response.data?.data || [];
        }
        catch (error) {
            console.log("FAILED TO FETCH MY REVIEWS:", error.message);
            throw error;
        }
    }
    async getBookReviews(bookId, userId) {
        try {
            const bookServiceUrl = 'http://library-api-gateway:3000/library/books';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${bookServiceUrl}/books/${bookId}/reviews`));
            const reviews = response.data?.data || [];
            return reviews.map((review) => ({
                ...review, isCurrentUser: review.memberId === userId,
            }));
        }
        catch (error) {
            console.log("FAILED TO FETCH REVIEWS:", error.message);
            return [];
        }
    }
    async updateReview(reviewId, userId, data, token) {
        try {
            const bookServiceUrl = 'http://library-api-gateway:3000/library/books';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(`${bookServiceUrl}/books/reviews/${reviewId}`, data, {
                headers: {
                    Authorization: token,
                },
            }));
            return response.data?.data;
        }
        catch (error) {
            console.log("FAILED TO UPDATE REVIEW:", error.message);
            throw error;
        }
    }
};
exports.MemberDashboardService = MemberDashboardService;
exports.MemberDashboardService = MemberDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __param(2, (0, mongoose_1.InjectModel)(issue_book_entity_1.IssueBook.name)),
    __param(3, (0, mongoose_1.InjectModel)(book_request_entity_1.BookRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, axios_1.HttpService,
        mongoose_2.Model,
        mongoose_2.Model])
], MemberDashboardService);
//# sourceMappingURL=member-dashboard.service.js.map