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
const book_request_entity_1 = require("../entities/book-request.entity");
let RequestsService = RequestsService_1 = class RequestsService {
    constructor(bookRequestModel) {
        this.bookRequestModel = bookRequestModel;
        this.logger = new common_1.Logger(RequestsService_1.name);
    }
    async create(createDto) {
        const existingRequest = await this.bookRequestModel.findOne({ requestId: createDto.requestId }).exec();
        if (existingRequest) {
            throw new common_1.ConflictException('Request ID already exists');
        }
        const bookRequest = new this.bookRequestModel({
            ...createDto,
            bookId: new mongoose_2.Types.ObjectId(createDto.bookId),
            memberId: new mongoose_2.Types.ObjectId(createDto.memberId),
            requestDate: createDto.requestDate || new Date(),
            status: book_request_entity_1.RequestStatus.PENDING,
        });
        return bookRequest.save();
    }
    async findAll() {
        return this.bookRequestModel.find().sort({ requestDate: -1 }).exec();
    }
    async findOne(id) {
        const request = await this.bookRequestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Book request not found');
        }
        return request;
    }
    async findByMember(memberId) {
        return this.bookRequestModel.find({ memberId: new mongoose_2.Types.ObjectId(memberId) }).sort({ requestDate: -1 }).exec();
    }
    async approve(id) {
        const request = await this.bookRequestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Book request not found');
        }
        if (request.status !== book_request_entity_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending requests can be approved');
        }
        request.status = book_request_entity_1.RequestStatus.APPROVED;
        request.processedDate = new Date();
        return request.save();
    }
    async reject(id) {
        const request = await this.bookRequestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Book request not found');
        }
        if (request.status !== book_request_entity_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending requests can be rejected');
        }
        request.status = book_request_entity_1.RequestStatus.REJECTED;
        request.processedDate = new Date();
        return request.save();
    }
    async remove(id) {
        const result = await this.bookRequestModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Book request not found');
        }
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = RequestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_request_entity_1.BookRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RequestsService);
//# sourceMappingURL=requests.service.js.map