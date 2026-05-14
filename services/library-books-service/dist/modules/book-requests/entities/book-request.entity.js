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
exports.BookRequestSchema = exports.BookRequest = exports.BookRequestStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var BookRequestStatus;
(function (BookRequestStatus) {
    BookRequestStatus["PENDING"] = "Pending";
    BookRequestStatus["APPROVED"] = "Approved";
    BookRequestStatus["REJECTED"] = "Rejected";
})(BookRequestStatus || (exports.BookRequestStatus = BookRequestStatus = {}));
let BookRequest = class BookRequest {
};
exports.BookRequest = BookRequest;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], BookRequest.prototype, "requestId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Book', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], BookRequest.prototype, "bookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Member', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], BookRequest.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], BookRequest.prototype, "requestDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: BookRequestStatus,
        default: BookRequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], BookRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], BookRequest.prototype, "currentlyBorrowed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], BookRequest.prototype, "totalHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'IssueBook' }] }),
    __metadata("design:type", Array)
], BookRequest.prototype, "activeBookIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], BookRequest.prototype, "booklistBorrowed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], BookRequest.prototype, "processedDate", void 0);
exports.BookRequest = BookRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BookRequest);
exports.BookRequestSchema = mongoose_1.SchemaFactory.createForClass(BookRequest);
exports.BookRequestSchema.index({ memberId: 1, status: 1 });
exports.BookRequestSchema.index({ bookId: 1, status: 1 });
exports.BookRequestSchema.index({ requestDate: -1 });
//# sourceMappingURL=book-request.entity.js.map