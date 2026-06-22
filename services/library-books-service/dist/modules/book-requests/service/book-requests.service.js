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
var BookRequestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_request_entity_1 = require("../entities/book-request.entity");
let BookRequestsService = BookRequestsService_1 = class BookRequestsService {
    constructor(bookRequestModel) {
        this.bookRequestModel = bookRequestModel;
        this.logger = new common_1.Logger(BookRequestsService_1.name);
    }
    async create(createBookRequestDto) {
        const { requestId, bookId, memberId, requestDate } = createBookRequestDto;
        const existingRequest = await this.bookRequestModel
            .findOne({ requestId })
            .exec();
        if (existingRequest) {
            throw new common_1.ConflictException('Request ID already exists');
        }
        const createdRequest = new this.bookRequestModel({
            requestId,
            bookId: new mongoose_2.Types.ObjectId(bookId),
            memberId: new mongoose_2.Types.ObjectId(memberId),
            requestDate: requestDate || new Date(),
            status: book_request_entity_1.BookRequestStatus.PENDING,
            currentlyBorrowed: 0,
            totalHistory: 0,
            activeBookIds: [],
            booklistBorrowed: [],
        });
        return createdRequest.save();
    }
    async findAll() {
        return this.bookRequestModel
            .find()
            .populate('bookId', 'title bookId author rackNumber')
            .populate('memberId', 'fullName memberId email phoneNumber membershipDate')
            .populate('processedBy', 'fullName staffId')
            .sort({ requestDate: -1 })
            .exec();
    }
    async findOne(id) {
        const bookRequest = await this.bookRequestModel
            .findById(id)
            .populate('bookId', 'title bookId author rackNumber shelfNumber')
            .populate('memberId', 'fullName memberId email phoneNumber membershipDate')
            .populate('activeBookIds')
            .populate('processedBy', 'fullName staffId')
            .exec();
        if (!bookRequest) {
            throw new common_1.NotFoundException('Book request not found');
        }
        return bookRequest;
    }
    async update(id, updateBookRequestDto) {
        const bookRequest = await this.bookRequestModel.findById(id).exec();
        if (!bookRequest) {
            throw new common_1.NotFoundException('Book request not found');
        }
        const { status, currentlyBorrowed, totalHistory } = updateBookRequestDto;
        if (status)
            bookRequest.status = status;
        if (currentlyBorrowed !== undefined)
            bookRequest.currentlyBorrowed = currentlyBorrowed;
        if (totalHistory !== undefined)
            bookRequest.totalHistory = totalHistory;
        await bookRequest.save();
        return this.bookRequestModel
            .findById(id)
            .populate('bookId', 'title bookId author')
            .populate('memberId', 'fullName memberId email')
            .exec();
    }
    async approve(id, processedBy) {
        const bookRequest = await this.bookRequestModel.findById(id).exec();
        if (!bookRequest) {
            throw new common_1.NotFoundException('Book request not found');
        }
        if (!/pending/i.test(bookRequest.status)) {
            throw new common_1.BadRequestException('Only pending requests can be approved');
        }
        bookRequest.status = book_request_entity_1.BookRequestStatus.APPROVED;
        bookRequest.processedDate = new Date();
        bookRequest.processedBy = new mongoose_2.Types.ObjectId(processedBy);
        await bookRequest.save();
        return this.bookRequestModel
            .findById(id)
            .populate('bookId', 'title bookId author')
            .populate('memberId', 'fullName memberId email')
            .exec();
    }
    async reject(id, processedBy) {
        const bookRequest = await this.bookRequestModel.findById(id).exec();
        if (!bookRequest) {
            throw new common_1.NotFoundException('Book request not found');
        }
        if (!/pending/i.test(bookRequest.status)) {
            throw new common_1.BadRequestException('Only pending requests can be rejected');
        }
        bookRequest.status = book_request_entity_1.BookRequestStatus.REJECTED;
        bookRequest.processedDate = new Date();
        bookRequest.processedBy = new mongoose_2.Types.ObjectId(processedBy);
        await bookRequest.save();
        return this.bookRequestModel
            .findById(id)
            .populate('bookId', 'title bookId author')
            .populate('memberId', 'fullName memberId email')
            .exec();
    }
    async remove(id) {
        const result = await this.bookRequestModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Book request not found');
        }
    }
    async findByMember(memberId) {
        return this.bookRequestModel
            .find({ memberId: new mongoose_2.Types.ObjectId(memberId) })
            .populate('bookId', 'title bookId author coverImage')
            .sort({ requestDate: -1 })
            .exec();
    }
    async cancel(id, memberId) {
        const bookRequest = await this.bookRequestModel.findById(id).exec();
        if (!bookRequest) {
            throw new common_1.NotFoundException('Book request not found');
        }
        if (bookRequest.memberId.toString() !== memberId) {
            throw new common_1.ForbiddenException('Not authorized to cancel this request');
        }
        if (bookRequest.status !== book_request_entity_1.BookRequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending requests can be cancelled');
        }
        await this.bookRequestModel.findByIdAndDelete(id).exec();
    }
};
exports.BookRequestsService = BookRequestsService;
exports.BookRequestsService = BookRequestsService = BookRequestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_request_entity_1.BookRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BookRequestsService);
//# sourceMappingURL=book-requests.service.js.map