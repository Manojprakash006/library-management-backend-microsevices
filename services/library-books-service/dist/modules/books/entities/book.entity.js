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
exports.BookSchema = exports.Book = exports.BookStatus = exports.BookCondition = exports.BookType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var BookType;
(function (BookType) {
    BookType["ISSUE_BOOK"] = "Issue Book";
    BookType["REFERENCE_BOOK"] = "Reference Book";
})(BookType || (exports.BookType = BookType = {}));
var BookCondition;
(function (BookCondition) {
    BookCondition["NEW"] = "New";
    BookCondition["GOOD"] = "Good";
    BookCondition["FAIR"] = "Fair";
    BookCondition["POOR"] = "Poor";
    BookCondition["DAMAGED"] = "Damaged";
})(BookCondition || (exports.BookCondition = BookCondition = {}));
var BookStatus;
(function (BookStatus) {
    BookStatus["AVAILABLE"] = "available";
    BookStatus["ISSUED"] = "issued";
    BookStatus["MAINTENANCE"] = "maintenance";
    BookStatus["LOST"] = "lost";
    BookStatus["DAMAGED"] = "damaged";
})(BookStatus || (exports.BookStatus = BookStatus = {}));
let Book = class Book {
};
exports.Book = Book;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, index: true }),
    __metadata("design:type", String)
], Book.prototype, "bookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, sparse: true }),
    __metadata("design:type", String)
], Book.prototype, "isbn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, set: (val) => val?.toUpperCase(), trim: true, minlength: 1, maxlength: 500, index: true }),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, set: (val) => val?.toUpperCase(), trim: true, minlength: 1, maxlength: 200, index: true }),
    __metadata("design:type", String)
], Book.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 200 }),
    __metadata("design:type", String)
], Book.prototype, "publisher", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 1000, max: new Date().getFullYear() + 1 }),
    __metadata("design:type", Number)
], Book.prototype, "publishYear", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, index: true }),
    __metadata("design:type", String)
], Book.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Book.prototype, "edition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Book.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 1 }),
    __metadata("design:type", Number)
], Book.prototype, "pages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], Book.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, index: true }),
    __metadata("design:type", String)
], Book.prototype, "rackNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Book.prototype, "shelfNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: BookType, default: BookType.ISSUE_BOOK }),
    __metadata("design:type", String)
], Book.prototype, "bookType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: BookCondition, default: BookCondition.GOOD }),
    __metadata("design:type", String)
], Book.prototype, "condition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: BookStatus, default: BookStatus.AVAILABLE }),
    __metadata("design:type", String)
], Book.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 2000 }),
    __metadata("design:type", String)
], Book.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1, min: 0 }),
    __metadata("design:type", Number)
], Book.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], Book.prototype, "damagedQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], Book.prototype, "lostQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Book.prototype, "coverUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, max: 5, default: 0 }),
    __metadata("design:type", Number)
], Book.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Book.prototype, "createdBy", void 0);
exports.Book = Book = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Book);
exports.BookSchema = mongoose_1.SchemaFactory.createForClass(Book);
exports.BookSchema.index({ title: 'text', author: 'text', category: 'text' });
exports.BookSchema.index({ category: 1, rackNumber: 1 });
//# sourceMappingURL=book.entity.js.map