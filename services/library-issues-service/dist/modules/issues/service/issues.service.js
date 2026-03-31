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
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const issue_book_entity_1 = require("../entities/issue-book.entity");
let IssuesService = IssuesService_1 = class IssuesService {
    constructor(issueBookModel, httpService) {
        this.issueBookModel = issueBookModel;
        this.httpService = httpService;
        this.logger = new common_1.Logger(IssuesService_1.name);
    }
    async logActivity(adminId, action, entityId, details) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${membersServiceUrl}/activities/logs`, {
                adminId,
                action,
                entityType: 'ISSUE',
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
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
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
    async create(createIssueDto, adminId) {
        const startDate = createIssueDto.issueDate ? new Date(createIssueDto.issueDate) : new Date();
        let dueDate = null;
        let numberOfDays = null;
        if (createIssueDto.issueType === issue_book_entity_1.IssueType.TAKING_HOME) {
            numberOfDays = createIssueDto.numberOfDays || 7;
            dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + numberOfDays);
        }
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            const bookResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/books/${createIssueDto.bookId}`));
            const bookData = bookResponse.data?.data;
            if (!bookData) {
                throw new common_1.BadRequestException('Book not found');
            }
            if (bookData.bookType === 'Reference Book' && createIssueDto.issueType === issue_book_entity_1.IssueType.TAKING_HOME) {
                throw new common_1.BadRequestException('Reference books can only be read inside the library and cannot be taken home.');
            }
            const currentIssuesCount = await this.getBookIssueCount(createIssueDto.bookId);
            const maxQuantity = bookData.quantity || 1;
            if (currentIssuesCount >= maxQuantity) {
                throw new common_1.BadRequestException('Book is out of stock and cannot be issued (all copies are currently issued)');
            }
            const existingIssue = await this.issueBookModel.findOne({
                bookId: new mongoose_2.Types.ObjectId(createIssueDto.bookId),
                memberId: new mongoose_2.Types.ObjectId(createIssueDto.memberId),
                status: { $in: [issue_book_entity_1.IssueStatus.ACTIVE, issue_book_entity_1.IssueStatus.OVERDUE] }
            }).exec();
            if (existingIssue) {
                throw new common_1.ConflictException('This member already has an active issue for this book.');
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.BadRequestException('Failed to verify book availability. Book may not exist.');
        }
        const issuedBook = new this.issueBookModel({
            bookId: new mongoose_2.Types.ObjectId(createIssueDto.bookId),
            memberId: new mongoose_2.Types.ObjectId(createIssueDto.memberId),
            issueType: createIssueDto.issueType,
            numberOfDays,
            issueDate: startDate,
            dueDate,
            status: issue_book_entity_1.IssueStatus.ACTIVE,
        });
        const savedIssue = await issuedBook.save();
        let newBookStatus = 'available';
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            const bookResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/books/${createIssueDto.bookId}`));
            const bookData = bookResponse.data?.data;
            const maxQuantity = bookData?.quantity || 1;
            const currentIssuesCountAfterThis = await this.getBookIssueCount(createIssueDto.bookId);
            if (currentIssuesCountAfterThis >= maxQuantity) {
                newBookStatus = 'issued';
            }
        }
        catch (e) {
            newBookStatus = 'issued';
        }
        await this.updateBookStatus(createIssueDto.bookId, newBookStatus);
        await this.addToBorrowingHistory(createIssueDto.memberId, createIssueDto.bookId, savedIssue._id.toString(), startDate, dueDate);
        if (adminId) {
            await this.logActivity(adminId, 'ISSUE_BOOK', savedIssue._id.toString(), {
                bookId: createIssueDto.bookId,
                memberId: createIssueDto.memberId
            });
        }
        await this.sendNotification(createIssueDto.memberId, 'BOOK_ISSUED', 'Book Issued Successfully', `You have successfully borrowed the book (ID: ${createIssueDto.bookId}). ${dueDate ? `Please make sure to return it by ${dueDate.toLocaleDateString()} to avoid any fines.` : 'Enjoy reading inside the library!'}`);
        return savedIssue;
    }
    async addToBorrowingHistory(memberId, bookId, issueId, borrowedAt, dueDate) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${membersServiceUrl}/members/${memberId}/borrowing-history`, {
                bookId,
                issueId,
                borrowedAt,
                dueDate,
                status: 'borrowed'
            }));
            this.logger.log(`Added borrowing history for member ${memberId}`);
        }
        catch (error) {
            this.logger.error(`Failed to add borrowing history: ${error.message}`);
        }
    }
    async updateBookStatus(bookId, status) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`${booksServiceUrl}/books/${bookId}/status`, { status }));
        }
        catch (error) {
            this.logger.error(`Failed to update book status: ${error.message}`);
        }
    }
    async updateBorrowingHistory(memberId, issueId, returnedAt, fine) {
        try {
            const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
            await (0, rxjs_1.firstValueFrom)(this.httpService.put(`${membersServiceUrl}/members/${memberId}/borrowing-history/${issueId}`, {
                returnedAt,
                fine,
                status: 'returned'
            }));
            this.logger.log(`Updated borrowing history for member ${memberId}`);
        }
        catch (error) {
            this.logger.error(`Failed to update borrowing history: ${error.message}`);
        }
    }
    async updateBookStatusByObjectId(bookObjectId, status) {
        try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`${booksServiceUrl}/books/${bookObjectId}/status`, { status }));
        }
        catch (error) {
            this.logger.error(`Failed to update book status: ${error.message}`);
        }
    }
    async findAll() {
        const issuedBooks = await this.issueBookModel.find().exec();
        const today = new Date();
        return issuedBooks.map((issue) => {
            const issueObj = issue.toObject();
            if (issueObj.status !== issue_book_entity_1.IssueStatus.RETURNED &&
                issueObj.issueType === issue_book_entity_1.IssueType.TAKING_HOME &&
                issueObj.dueDate &&
                new Date(issueObj.dueDate) < today) {
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
        const issuedBooks = await this.issueBookModel.find({ memberId: new mongoose_2.Types.ObjectId(memberId) }).exec();
        const today = new Date();
        return issuedBooks.map((issue) => {
            const issueObj = issue.toObject();
            if (issueObj.status !== issue_book_entity_1.IssueStatus.RETURNED &&
                issueObj.issueType === issue_book_entity_1.IssueType.TAKING_HOME &&
                issueObj.dueDate &&
                new Date(issueObj.dueDate) < today) {
                const overdueDays = Math.ceil((today.getTime() - new Date(issueObj.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                issueObj.status = issue_book_entity_1.IssueStatus.OVERDUE;
                issueObj.daysOverdue = overdueDays;
                issueObj.fine = overdueDays * (issueObj.finePerDay || 10);
            }
            return issueObj;
        });
    }
    async findActiveByMember(memberId) {
        return this.issueBookModel.find({
            memberId: new mongoose_2.Types.ObjectId(memberId),
            status: { $in: [issue_book_entity_1.IssueStatus.ACTIVE, issue_book_entity_1.IssueStatus.OVERDUE] },
        }).exec();
    }
    async returnBook(id, adminId) {
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
        if (issuedBook.issueType === issue_book_entity_1.IssueType.TAKING_HOME && issuedBook.dueDate && returnDate > issuedBook.dueDate) {
            const overdueDays = Math.ceil((returnDate.getTime() - issuedBook.dueDate.getTime()) / (1000 * 60 * 60 * 24));
            issuedBook.daysOverdue = overdueDays;
            issuedBook.fine = overdueDays * issuedBook.finePerDay;
        }
        const savedIssue = await issuedBook.save();
        const bookId = issuedBook.bookId.toString();
        await this.updateBookStatus(bookId, 'available');
        await this.updateBorrowingHistory(issuedBook.memberId.toString(), issuedBook._id.toString(), returnDate, issuedBook.fine || 0);
        if (adminId) {
            await this.logActivity(adminId, 'RETURN_BOOK', savedIssue._id.toString(), {
                bookId: issuedBook.bookId,
                memberId: issuedBook.memberId
            });
        }
        await this.sendNotification(issuedBook.memberId.toString(), 'BOOK_RETURNED', 'Book Returned Successfully', `Thank you! You have successfully returned the book (ID: ${issuedBook.bookId}) on ${returnDate.toLocaleDateString()}.${issuedBook.fine > 0 ? ` Note: A fine of rs ${issuedBook.fine} was calculated for late return.` : ''}`);
        return savedIssue;
    }
    async update(id, updateIssueDto, adminId) {
        const issuedBook = await this.issueBookModel.findById(id).exec();
        if (!issuedBook) {
            throw new common_1.NotFoundException('Issued book record not found');
        }
        if (updateIssueDto.numberOfDays && updateIssueDto.issueDate) {
            const startDate = new Date(updateIssueDto.issueDate);
            const dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + updateIssueDto.numberOfDays);
            updateIssueDto.dueDate = dueDate;
        }
        Object.assign(issuedBook, updateIssueDto);
        const savedIssue = await issuedBook.save();
        if (adminId) {
            await this.logActivity(adminId, 'UPDATE', savedIssue._id.toString(), { updatedFields: Object.keys(updateIssueDto) });
        }
        return savedIssue;
    }
    async findRecent(limit = 5) {
        return this.issueBookModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async getOverdueCount() {
        const today = new Date();
        const issues = await this.issueBookModel.find({
            status: { $in: [issue_book_entity_1.IssueStatus.ACTIVE, issue_book_entity_1.IssueStatus.OVERDUE] },
            issueType: issue_book_entity_1.IssueType.TAKING_HOME,
            dueDate: { $lt: today },
        }).exec();
        return issues.length;
    }
    async getIssuesCount(date) {
        if (!date) {
            return this.issueBookModel.countDocuments();
        }
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);
        return this.issueBookModel.countDocuments({
            issueDate: { $gte: startOfDay, $lt: endOfDay },
        });
    }
    async getReturnsCount(date) {
        if (!date) {
            return this.issueBookModel.countDocuments({ status: issue_book_entity_1.IssueStatus.RETURNED });
        }
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);
        return this.issueBookModel.countDocuments({
            status: issue_book_entity_1.IssueStatus.RETURNED,
            returnDate: { $gte: startOfDay, $lt: endOfDay },
        });
    }
    async getBookIssueCount(bookId) {
        return this.issueBookModel.countDocuments({
            bookId: new mongoose_2.Types.ObjectId(bookId),
            status: { $in: [issue_book_entity_1.IssueStatus.ACTIVE, issue_book_entity_1.IssueStatus.OVERDUE] },
        });
    }
    async remove(id, adminId) {
        const result = await this.issueBookModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Issued book record not found');
        }
        if (adminId) {
            await this.logActivity(adminId, 'DELETE', id, { bookId: result.bookId });
        }
    }
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = IssuesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(issue_book_entity_1.IssueBook.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService])
], IssuesService);
//# sourceMappingURL=issues.service.js.map