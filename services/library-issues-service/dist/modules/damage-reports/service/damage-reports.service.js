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
var DamageReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_damage_report_entity_1 = require("../entities/book-damage-report.entity");
let DamageReportsService = DamageReportsService_1 = class DamageReportsService {
    constructor(bookDamageReportModel) {
        this.bookDamageReportModel = bookDamageReportModel;
        this.logger = new common_1.Logger(DamageReportsService_1.name);
    }
    async create(createBookDamageReportDto) {
        const { reportId, issueId, bookId, memberId, reason, bookAmount, fineAmount, totalAmount } = createBookDamageReportDto;
        const createdReport = new this.bookDamageReportModel({
            reportId,
            issueId: new mongoose_2.Types.ObjectId(issueId),
            bookId: new mongoose_2.Types.ObjectId(bookId),
            memberId: new mongoose_2.Types.ObjectId(memberId),
            reason,
            bookAmount,
            fineAmount,
            totalAmount,
            status: book_damage_report_entity_1.DamageReportStatus.PENDING,
            reportDate: new Date(),
        });
        return createdReport.save();
    }
    async findAll(status) {
        const filter = status ? { status } : {};
        return this.bookDamageReportModel
            .find(filter)
            .populate('bookId', 'title author isbn')
            .populate('memberId', 'memberId fullName email phoneNumber')
            .populate('issueId', 'issueDate dueDate')
            .sort({ reportDate: -1 })
            .exec();
    }
    async findOne(id) {
        const report = await this.bookDamageReportModel
            .findById(id)
            .populate('bookId', 'title author isbn')
            .populate('memberId', 'memberId fullName email phoneNumber')
            .populate('issueId', 'issueDate dueDate')
            .exec();
        if (!report) {
            throw new common_1.NotFoundException('Damage report not found');
        }
        return report;
    }
    async approve(id) {
        const report = await this.bookDamageReportModel.findById(id).exec();
        if (!report) {
            throw new common_1.NotFoundException('Damage report not found');
        }
        report.status = book_damage_report_entity_1.DamageReportStatus.APPROVED;
        report.processedDate = new Date();
        await report.save();
        return this.bookDamageReportModel
            .findById(id)
            .populate('bookId', 'title author isbn')
            .populate('memberId', 'memberId fullName email phoneNumber')
            .populate('issueId', 'issueDate dueDate')
            .exec();
    }
    async reject(id) {
        const report = await this.bookDamageReportModel.findById(id).exec();
        if (!report) {
            throw new common_1.NotFoundException('Damage report not found');
        }
        report.status = book_damage_report_entity_1.DamageReportStatus.REJECTED;
        report.processedDate = new Date();
        await report.save();
        return this.bookDamageReportModel
            .findById(id)
            .populate('bookId', 'title author isbn')
            .populate('memberId', 'memberId fullName email phoneNumber')
            .populate('issueId', 'issueDate dueDate')
            .exec();
    }
    async remove(id) {
        const result = await this.bookDamageReportModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Damage report not found');
        }
    }
};
exports.DamageReportsService = DamageReportsService;
exports.DamageReportsService = DamageReportsService = DamageReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_damage_report_entity_1.BookDamageReport.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DamageReportsService);
//# sourceMappingURL=damage-reports.service.js.map