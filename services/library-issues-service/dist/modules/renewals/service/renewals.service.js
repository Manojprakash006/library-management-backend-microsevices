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
var RenewalsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewalsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_renewal_entity_1 = require("../entities/book-renewal.entity");
let RenewalsService = RenewalsService_1 = class RenewalsService {
    constructor(bookRenewalModel) {
        this.bookRenewalModel = bookRenewalModel;
        this.logger = new common_1.Logger(RenewalsService_1.name);
    }
    async create(createBookRenewalDto) {
        const { renewalId, issueId, memberId, currentDueDate, newDueDate } = createBookRenewalDto;
        const createdRenewal = new this.bookRenewalModel({
            renewalId,
            issueId: new mongoose_2.Types.ObjectId(issueId),
            memberId: new mongoose_2.Types.ObjectId(memberId),
            currentDueDate,
            newDueDate,
            status: book_renewal_entity_1.RenewalStatus.PENDING,
            requestDate: new Date(),
        });
        return createdRenewal.save();
    }
    async findAll(status) {
        const filter = status ? { status } : {};
        return this.bookRenewalModel
            .find(filter)
            .populate({
            path: 'issueId',
            populate: { path: 'bookId', select: 'title author' }
        })
            .populate('memberId', 'memberId fullName email')
            .sort({ requestDate: -1 })
            .exec();
    }
    async findOne(id) {
        const renewal = await this.bookRenewalModel
            .findById(id)
            .populate({
            path: 'issueId',
            populate: { path: 'bookId', select: 'title author' }
        })
            .populate('memberId', 'memberId fullName email')
            .exec();
        if (!renewal) {
            throw new common_1.NotFoundException('Renewal request not found');
        }
        return renewal;
    }
    async approve(id) {
        const renewal = await this.bookRenewalModel.findById(id).exec();
        if (!renewal) {
            throw new common_1.NotFoundException('Renewal request not found');
        }
        renewal.status = book_renewal_entity_1.RenewalStatus.APPROVED;
        renewal.processedDate = new Date();
        await renewal.save();
        return this.bookRenewalModel
            .findById(id)
            .populate({
            path: 'issueId',
            populate: { path: 'bookId', select: 'title author' }
        })
            .populate('memberId', 'memberId fullName email')
            .exec();
    }
    async reject(id) {
        const renewal = await this.bookRenewalModel.findById(id).exec();
        if (!renewal) {
            throw new common_1.NotFoundException('Renewal request not found');
        }
        renewal.status = book_renewal_entity_1.RenewalStatus.REJECTED;
        renewal.processedDate = new Date();
        await renewal.save();
        return this.bookRenewalModel
            .findById(id)
            .populate({
            path: 'issueId',
            populate: { path: 'bookId', select: 'title author' }
        })
            .populate('memberId', 'memberId fullName email')
            .exec();
    }
    async remove(id) {
        const result = await this.bookRenewalModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Renewal request not found');
        }
    }
};
exports.RenewalsService = RenewalsService;
exports.RenewalsService = RenewalsService = RenewalsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_renewal_entity_1.BookRenewal.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RenewalsService);
//# sourceMappingURL=renewals.service.js.map