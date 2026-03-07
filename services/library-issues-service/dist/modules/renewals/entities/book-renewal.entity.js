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
exports.BookRenewalSchema = exports.BookRenewal = exports.RenewalStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var RenewalStatus;
(function (RenewalStatus) {
    RenewalStatus["PENDING"] = "Pending";
    RenewalStatus["APPROVED"] = "Approved";
    RenewalStatus["REJECTED"] = "Rejected";
})(RenewalStatus || (exports.RenewalStatus = RenewalStatus = {}));
let BookRenewal = class BookRenewal {
};
exports.BookRenewal = BookRenewal;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], BookRenewal.prototype, "renewalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'IssueBook', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], BookRenewal.prototype, "issueId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Member', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], BookRenewal.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], BookRenewal.prototype, "currentDueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], BookRenewal.prototype, "newDueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: RenewalStatus,
        default: RenewalStatus.PENDING,
    }),
    __metadata("design:type", String)
], BookRenewal.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], BookRenewal.prototype, "requestDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], BookRenewal.prototype, "processedDate", void 0);
exports.BookRenewal = BookRenewal = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BookRenewal);
exports.BookRenewalSchema = mongoose_1.SchemaFactory.createForClass(BookRenewal);
exports.BookRenewalSchema.index({ memberId: 1, status: 1 });
exports.BookRenewalSchema.index({ issueId: 1 });
exports.BookRenewalSchema.index({ requestDate: -1 });
//# sourceMappingURL=book-renewal.entity.js.map