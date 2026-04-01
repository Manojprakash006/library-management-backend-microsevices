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
var RequestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const book_request_entity_1 = require("../entities/book-request.entity");
let RequestsService = RequestsService_1 = class RequestsService {
    constructor(bookRequestModel, httpService) {
        this.bookRequestModel = bookRequestModel;
        this.httpService = httpService;
        this.logger = new common_1.Logger(RequestsService_1.name);
    }
    async logActivity(adminId, action, entityId, details) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${membersServiceUrl}/activities/logs`, {
                adminId,
                action,
                entityType: 'REQUEST',
                entityId,
                details
            }));
        }
        catch (error) {
            this.logger.error(`Failed to log activity to member service: ${error.message}`);
        }
    }
    async sendNotification(memberId, type, title, message) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${membersServiceUrl}/notifications`, {
                memberId,
                type,
                title,
                message
            }));
        }
        catch (error) {
            this.logger.error(`Failed to send notification to member service: ${error.message}`);
        }
    }
    async notifyAdmins(type, title, message) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${membersServiceUrl}/notifications/admin`, {
                type,
                title,
                message
            }));
        }
        catch (error) {
            this.logger.error(`Failed to broadcast to admins: ${error.message}`);
        }
    }
    async create(createDto) {
        const existingPendingRequest = await this.bookRequestModel.findOne({
            memberId: new mongoose_2.Types.ObjectId(createDto.memberId),
            bookId: new mongoose_2.Types.ObjectId(createDto.bookId),
            status: book_request_entity_1.RequestStatus.PENDING
        }).exec();
        if (existingPendingRequest) {
            throw new common_1.ConflictException('You have already requested this book and it is pending approval.');
        }
        const { currentlyBorrowed, totalHistory, activeBookIds } = await this.getMemberBorrowingDetails(createDto.memberId);
        const alreadyBorrowed = activeBookIds.some(id => id.toString() === createDto.bookId.toString());
        if (alreadyBorrowed) {
            throw new common_1.ConflictException('You have already borrowed this book. Please return it before requesting again.');
        }
        let bookNameInitials = 'BOK';
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            const bookResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/books/${createDto.bookId}`));
            const bookTitle = bookResponse.data?.data?.title || '';
            if (bookTitle) {
                const cleanedTitle = bookTitle.replace(/[^a-zA-Z]/g, '');
                if (cleanedTitle.length > 0) {
                    bookNameInitials = cleanedTitle.substring(0, 3).toUpperCase();
                }
            }
        }
        catch (error) {
            this.logger.error(`Failed to fetch book details for ID generation: ${error.message}`);
        }
        const count = await this.bookRequestModel.countDocuments();
        const generatedRequestId = `REQ-${bookNameInitials}-${count + 1}`;
        const bookRequest = new this.bookRequestModel({
            ...createDto,
            requestId: generatedRequestId,
            bookId: new mongoose_2.Types.ObjectId(createDto.bookId),
            memberId: new mongoose_2.Types.ObjectId(createDto.memberId),
            requestDate: createDto.requestDate || new Date(),
            status: book_request_entity_1.RequestStatus.PENDING,
            currentlyBorrowed,
            totalHistory,
        });
        const savedRequest = await bookRequest.save();
        await this.notifyAdmins('NEW_BOOK_REQUEST', 'New Book Request Received', `A new request has been placed for Book ID: ${createDto.bookId} by Member ID: ${createDto.memberId}. Please review it in the pending requests dashboard.`);
        return savedRequest;
    }
    async getMemberBorrowingDetails(memberId) {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/member/${memberId}`));
            const allIssues = response.data?.data || [];
            const activeIssues = allIssues.filter((issue) => issue.status === 'Active' || issue.status === 'Overdue');
            const currentlyBorrowed = activeIssues.length;
            const totalHistory = allIssues.length;
            const activeBookIds = activeIssues
                .map((issue) => issue.bookId)
                .filter((id) => id)
                .map((id) => new mongoose_2.Types.ObjectId(id));
            const booklistBorrowed = activeIssues.map((issue) => {
                const dueDate = issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'N/A';
                return `${issue.bookId} - ${issue.issueType} - ${issue.status} - Due: ${dueDate}`;
            });
            return { currentlyBorrowed, totalHistory, activeBookIds, booklistBorrowed };
        }
        catch (error) {
            this.logger.error(`Failed to fetch member borrowing details from issues service: ${error.message}`);
            return { currentlyBorrowed: 0, totalHistory: 0, activeBookIds: [], booklistBorrowed: [] };
        }
    }
    async findAll() {
        const requests = await this.bookRequestModel.find().sort({ requestDate: -1 }).exec();
        const enrichedRequests = await Promise.all(requests.map(async (request) => {
            const memberStats = await this.getMemberBorrowingDetails(request.memberId.toString());
            return {
                ...request.toObject(),
                currentlyBorrowed: memberStats.currentlyBorrowed,
                totalHistory: memberStats.totalHistory,
                activeBookIds: memberStats.activeBookIds,
                booklistBorrowed: memberStats.booklistBorrowed,
            };
        }));
        return enrichedRequests;
    }
    async findOne(id) {
        const request = await this.bookRequestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Book request not found');
        }
        return request;
    }
    async findByMember(memberId) {
        const requests = await this.bookRequestModel.find({ memberId: new mongoose_2.Types.ObjectId(memberId) }).sort({ requestDate: -1 }).exec();
        const memberStats = await this.getMemberBorrowingDetails(memberId);
        const enrichedRequests = requests.map((request) => ({
            ...request.toObject(),
            currentlyBorrowed: memberStats.currentlyBorrowed,
            totalHistory: memberStats.totalHistory,
            activeBookIds: memberStats.activeBookIds,
            booklistBorrowed: memberStats.booklistBorrowed,
        }));
        return enrichedRequests;
    }
    async update(id, updateDto) {
        const request = await this.bookRequestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Book request not found');
        }
        if (request.status !== book_request_entity_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending requests can be updated');
        }
        Object.assign(request, updateDto);
        return request.save();
    }
    async cancel(id, memberId) {
        const request = await this.bookRequestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Book request not found');
        }
        if (request.memberId.toString() !== memberId) {
            throw new common_1.BadRequestException('Not authorized to cancel this request');
        }
        if (request.status !== book_request_entity_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending requests can be cancelled');
        }
        request.status = book_request_entity_1.RequestStatus.CANCELLED;
        request.processedDate = new Date();
        return request.save();
    }
    async approve(id, adminId) {
        const request = await this.bookRequestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Book request not found');
        }
        if (request.status !== book_request_entity_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending requests can be approved');
        }
        request.status = book_request_entity_1.RequestStatus.APPROVED;
        request.processedDate = new Date();
        const savedRequest = await request.save();
        if (adminId) {
            await this.logActivity(adminId, 'APPROVE', id, { bookId: request.bookId, memberId: request.memberId });
        }
        await this.sendNotification(request.memberId.toString(), 'REQUEST_APPROVED', 'Book Request Approved', `Your request for book (ID: ${request.bookId}) has been approved. You can now collect the book from the library.`);
        return savedRequest;
    }
    async reject(id, adminId) {
        const request = await this.bookRequestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Book request not found');
        }
        if (request.status !== book_request_entity_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending requests can be rejected');
        }
        request.status = book_request_entity_1.RequestStatus.REJECTED;
        request.processedDate = new Date();
        const savedRequest = await request.save();
        if (adminId) {
            await this.logActivity(adminId, 'REJECT', id, { bookId: request.bookId, memberId: request.memberId });
        }
        await this.sendNotification(request.memberId.toString(), 'REQUEST_REJECTED', 'Book Request Rejected', `Unfortunately, your request for book (ID: ${request.bookId}) has been rejected. Please contact the librarian for more details.`);
        return savedRequest;
    }
    async remove(id) {
        const result = await this.bookRequestModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Book request not found');
        }
    }
    async getPendingCount() {
        return this.bookRequestModel.countDocuments({ status: book_request_entity_1.RequestStatus.PENDING });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = RequestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_request_entity_1.BookRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map