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
var IssuesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const issue_book_entity_1 = require("../entities/issue-book.entity");
let IssuesService = IssuesService_1 = class IssuesService {
    constructor(issueBookModel) {
        this.issueBookModel = issueBookModel;
        this.logger = new common_1.Logger(IssuesService_1.name);
    }
    async create(createIssueDto) {
        const startDate = createIssueDto.issueDate ? new Date(createIssueDto.issueDate) : new Date();
        const dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + createIssueDto.numberOfDays);
        const issuedBook = new this.issueBookModel({
            bookId: new mongoose_2.Types.ObjectId(createIssueDto.bookId),
            memberId: new mongoose_2.Types.ObjectId(createIssueDto.memberId),
            issueType: createIssueDto.issueType,
            numberOfDays: createIssueDto.numberOfDays,
            issueDate: startDate,
            dueDate,
            status: issue_book_entity_1.IssueStatus.ACTIVE,
        });
        return issuedBook.save();
    }
    async findAll() {
        const issuedBooks = await this.issueBookModel.find().exec();
        const today = new Date();
        return issuedBooks.map((issue) => {
            const issueObj = issue.toObject();
            if (issueObj.status !== issue_book_entity_1.IssueStatus.RETURNED && new Date(issueObj.dueDate) < today) {
                const overdueDays = Math.ceil((today.getTime() - new Date(issueObj.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                issueObj.status = issue_book_entity_1.IssueStatus.OVERDUE;
                issueObj.daysOverdue = overdueDays;
                issueObj.fine = overdueDays * (issueObj.finePerDay || 10);
            }
            return issueObj;
        });
    }
    async findOne(id) {
        const issuedBook = await this.issueBookModel.findById(id).exec();
        if (!issuedBook) {
            throw new common_1.NotFoundException('Issued book record not found');
        }
        return issuedBook;
    }
    async findByMember(memberId) {
        return this.issueBookModel.find({ memberId: new mongoose_2.Types.ObjectId(memberId) }).exec();
    }
    async findActiveByMember(memberId) {
        return this.issueBookModel.find({
            memberId: new mongoose_2.Types.ObjectId(memberId),
            status: { $in: [issue_book_entity_1.IssueStatus.ACTIVE, issue_book_entity_1.IssueStatus.OVERDUE] },
        }).exec();
    }
    async returnBook(id) {
        const issuedBook = await this.issueBookModel.findById(id).exec();
        if (!issuedBook) {
            throw new common_1.NotFoundException('Issued book record not found');
        }
        if (issuedBook.status === issue_book_entity_1.IssueStatus.RETURNED) {
            throw new common_1.BadRequestException('Book already returned');
        }
        const returnDate = new Date();
        issuedBook.returnDate = returnDate;
        issuedBook.status = issue_book_entity_1.IssueStatus.RETURNED;
        if (returnDate > issuedBook.dueDate) {
            const overdueDays = Math.ceil((returnDate.getTime() - issuedBook.dueDate.getTime()) / (1000 * 60 * 60 * 24));
            issuedBook.daysOverdue = overdueDays;
            issuedBook.fine = overdueDays * issuedBook.finePerDay;
        }
        return issuedBook.save();
    }
    async remove(id) {
        const result = await this.issueBookModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Issued book record not found');
        }
    }
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = IssuesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(issue_book_entity_1.IssueBook.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IssuesService);
//# sourceMappingURL=issues.service.js.map