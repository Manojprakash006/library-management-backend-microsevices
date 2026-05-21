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
exports.BookCopySchema = exports.BookCopy = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_entity_1 = require("./book.entity");
let BookCopy = class BookCopy {
};
exports.BookCopy = BookCopy;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Book', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BookCopy.prototype, "bookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, index: true }),
    __metadata("design:type", String)
], BookCopy.prototype, "copyNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: book_entity_1.BookStatus, default: book_entity_1.BookStatus.AVAILABLE }),
    __metadata("design:type", String)
], BookCopy.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: book_entity_1.BookCondition, default: book_entity_1.BookCondition.GOOD }),
    __metadata("design:type", String)
], BookCopy.prototype, "condition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], BookCopy.prototype, "barcode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], BookCopy.prototype, "addedBy", void 0);
exports.BookCopy = BookCopy = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BookCopy);
exports.BookCopySchema = mongoose_1.SchemaFactory.createForClass(BookCopy);
exports.BookCopySchema.index({ bookId: 1, status: 1 });
//# sourceMappingURL=book-copy.entity.js.map