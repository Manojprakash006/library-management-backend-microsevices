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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueBookSchema = exports.IssueBook = exports.IssueStatus = exports.IssueType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var IssueType;
(function (IssueType) {
    IssueType["READING_INSIDE_LIBRARY"] = "Reading Inside Library";
    IssueType["TAKING_HOME"] = "Taking Home";
})(IssueType || (exports.IssueType = IssueType = {}));
var IssueStatus;
(function (IssueStatus) {
    IssueStatus["ACTIVE"] = "Active";
    IssueStatus["OVERDUE"] = "Overdue";
    IssueStatus["RETURNED"] = "Returned";
})(IssueStatus || (exports.IssueStatus = IssueStatus = {}));
let IssueBook = class IssueBook {
};
exports.IssueBook = IssueBook;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Book' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], IssueBook.prototype, "bookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Member' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], IssueBook.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: IssueType, required: true }),
    __metadata("design:type", String)
], IssueBook.prototype, "issueType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 1, required: false }),
    __metadata("design:type", Number)
], IssueBook.prototype, "numberOfDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], IssueBook.prototype, "issueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], IssueBook.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], IssueBook.prototype, "returnDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: IssueStatus, default: IssueStatus.ACTIVE }),
    __metadata("design:type", String)
], IssueBook.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], IssueBook.prototype, "daysOverdue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], IssueBook.prototype, "fine", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 10, min: 0 }),
    __metadata("design:type", Number)
], IssueBook.prototype, "finePerDay", void 0);
exports.IssueBook = IssueBook = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], IssueBook);
exports.IssueBookSchema = mongoose_1.SchemaFactory.createForClass(IssueBook);
exports.IssueBookSchema.index({ memberId: 1, status: 1 });
exports.IssueBookSchema.index({ bookId: 1, status: 1 });
exports.IssueBookSchema.index({ dueDate: 1, status: 1 });
exports.IssueBookSchema.index({ issueDate: -1 });
//# sourceMappingURL=issue-book.entity.js.map