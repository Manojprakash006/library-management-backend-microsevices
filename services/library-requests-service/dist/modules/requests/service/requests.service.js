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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const book_request_entity_1 = require("../entities/book-request.entity");
const redis_emitter_service_1 = require("../../redis-emitter/redis-emitter.service");
let RequestsService = RequestsService_1 = class RequestsService {
    constructor(bookRequestModel, httpService, redisEmitter) {
        this.bookRequestModel = bookRequestModel;
        this.httpService = httpService;
        this.redisEmitter = redisEmitter;
        this.logger = new common_1.Logger(RequestsService_1.name);
    }
    async logActivity(adminId, action, entityId, details) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
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
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
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
    async notifyAdmins(type, title, message, issueId) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${membersServiceUrl}/notifications/admin`, {
                type,
                title,
                message,
                issueId
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
        const bookRequest = new this.bookRequestModel({
            ...createDto,
            bookId: new mongoose_2.Types.ObjectId(createDto.bookId),
            memberId: new mongoose_2.Types.ObjectId(createDto.memberId),
            requestDate: createDto.requestDate || new Date(),
            status: book_request_entity_1.RequestStatus.PENDING,
            currentlyBorrowed,
            totalHistory,
        });
        const savedRequest = await bookRequest.save();
        await this.notifyAdmins('NEW_BOOK_REQUEST', 'New Book Request Received', `A new request has been placed for Book ID: ${createDto.bookId} by Member ID: ${createDto.memberId}.`, createDto.bookId);
        await this.redisEmitter.emit('REQUEST_CREATED', savedRequest);
        await this.redisEmitter.emit('REQUESTS_UPDATED', { type: 'create', request: savedRequest });
        await this.invalidatePendingCountCache();
        return savedRequest;
    }
    async getMemberBorrowingDetails(memberId) {
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
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
    async findAll(page = 1, limit = 10, status, search) {
        const skip = (page - 1) * limit;
        const query = {};
        if (status) {
            const statuses = status.split(',').map(s => s.trim());
            query.status = { $in: statuses.map(s => new RegExp(`^${s}$`, 'i')) };
        }
        if (search) {
            query.$or = [
                { requestId: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } }
            ];
        }
        const [requests, total] = await Promise.all([
            this.bookRequestModel.find(query).sort({ requestDate: -1 }).skip(skip).limit(limit).lean().exec(),
            this.bookRequestModel.countDocuments(query).exec(),
        ]);
        const memberIds = [...new Set(requests.map(r => r.memberId.toString()))];
        let bulkStats = {};
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${issuesServiceUrl}/issues/batch-stats`, { memberIds }));
            bulkStats = response.data?.data || {};
        }
        catch (error) {
            this.logger.error(`Failed to fetch bulk member stats: ${error.message}`);
        }
        const enrichedRequests = requests.map((request) => {
            const memberId = request.memberId.toString();
            const stats = bulkStats[memberId] || { currentlyBorrowed: 0, totalHistory: 0, activeBookIds: [], booklistBorrowed: [] };
            return {
                ...request,
                currentlyBorrowed: stats.currentlyBorrowed,
                totalHistory: stats.totalHistory,
                activeBookIds: stats.activeBookIds,
                booklistBorrowed: stats.booklistBorrowed,
            };
        });
        return {
            data: enrichedRequests,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getByMember(memberId) {
        const data = await this.bookRequestModel.find({
            memberId: new mongoose_2.Types.ObjectId(memberId)
        }).lean();
        const enriched = await Promise.all(data.map(async (req) => {
            const bookId = req.bookId.toString();
            if (!bookId) {
                return { ...req, bookId: null };
            }
            try {
                const bookServiceURL = process.env.BOOKS_SERVICE_URL || "http://library-books-service:3001";
                const bookResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${bookServiceURL}/books/${bookId}`));
                const book = bookResponse.data?.data;
                return {
                    ...req,
                    bookId: book,
                };
            }
            catch (error) {
                console.log("❌ BOOK FETCH FAILED:", error.message);
                return {
                    ...req,
                    bookId: null,
                };
            }
        }));
        return enriched;
    }
    async findOne(id) {
        const request = await this.bookRequestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Book request not found');
        }
        return request;
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
        await this.invalidatePendingCountCache();
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
        const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || "http://library-members-service:3012";
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${membersServiceUrl}/members/${request.memberId}/borrow`, {
                bookId: request.bookId.toString(),
                issueId: request._id.toString(),
                borrowedAt: new Date(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                status: 'borrowed',
            }));
        }
        catch (error) {
            this.logger.error(`Failed to update borrowing history: ${error.message}`);
        }
        if (adminId) {
            this.logActivity(adminId, 'APPROVE', id, { bookId: request.bookId, memberId: request.memberId });
        }
        let bookTitle = 'Book';
        try {
            const bookServiceURL = process.env.BOOKS_SERVICE_URL || "http://library-books-service:3001";
            const bookRes = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${bookServiceURL}/books/${request.bookId}`));
            bookTitle = bookRes.data?.data?.title || 'Book';
        }
        catch (e) {
            this.logger.error(`Failed to fetch book title for approval notification: ${e.message}`);
        }
        this.sendNotification(request.memberId.toString(), 'REQUEST_APPROVED', 'Book Request Approved', `Dear member, your request for "${bookTitle}" (Book ID: ${request.bookId}) has been approved. You can now collect the book from the library.`);
        await this.redisEmitter.emit('REQUEST_APPROVED', savedRequest);
        await this.redisEmitter.emit('REQUESTS_UPDATED', { type: 'approve', request: savedRequest });
        await this.invalidatePendingCountCache();
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
            this.logActivity(adminId, 'REJECT', id, { bookId: request.bookId, memberId: request.memberId });
        }
        let bookTitle = 'Book';
        try {
            const bookServiceURL = process.env.BOOKS_SERVICE_URL || "http://library-books-service:3001";
            const bookRes = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${bookServiceURL}/books/${request.bookId}`));
            bookTitle = bookRes.data?.data?.title || 'Book';
        }
        catch (e) {
            this.logger.error(`Failed to fetch book title for rejection notification: ${e.message}`);
        }
        this.sendNotification(request.memberId.toString(), 'REQUEST_REJECTED', 'Book Request Rejected', `Unfortunately, your request for "${bookTitle}" (Book ID: ${request.bookId}) has been rejected. Please contact the librarian for more details.`);
        await this.redisEmitter.emit('REQUEST_REJECTED', savedRequest);
        await this.redisEmitter.emit('REQUESTS_UPDATED', { type: 'reject', request: savedRequest });
        await this.invalidatePendingCountCache();
        return savedRequest;
    }
    async remove(id) {
        const result = await this.bookRequestModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Book request not found');
        }
    }
    async getPendingCount() {
        const cacheKey = 'requests:pending_count';
        try {
            const cachedCount = await this.redisEmitter.redisClient.get(cacheKey);
            if (cachedCount !== null) {
                return parseInt(cachedCount, 10);
            }
        }
        catch (e) {
            this.logger.error(`Redis cache get error: ${e.message}`);
        }
        const count = await this.bookRequestModel.countDocuments({ status: book_request_entity_1.RequestStatus.PENDING }).exec();
        try {
            await this.redisEmitter.redisClient.set(cacheKey, count.toString(), 'EX', 300);
        }
        catch (e) {
            this.logger.error(`Redis cache set error: ${e.message}`);
        }
        return count;
    }
    async invalidatePendingCountCache() {
        try {
            await this.redisEmitter.redisClient.del('requests:pending_count');
        }
        catch (e) {
            this.logger.error(`Redis cache invalidate error: ${e.message}`);
        }
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = RequestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_request_entity_1.BookRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object, redis_emitter_service_1.RedisEmitterService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map