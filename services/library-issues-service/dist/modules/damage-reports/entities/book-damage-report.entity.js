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
exports.BookDamageReportSchema = exports.BookDamageReport = exports.DamageReportStatus = exports.DamageReportReason = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var DamageReportReason;
(function (DamageReportReason) {
    DamageReportReason["LOST"] = "Lost";
    DamageReportReason["DAMAGED"] = "Damaged";
})(DamageReportReason || (exports.DamageReportReason = DamageReportReason = {}));
var DamageReportStatus;
(function (DamageReportStatus) {
    DamageReportStatus["PENDING"] = "Pending";
    DamageReportStatus["APPROVED"] = "Approved";
    DamageReportStatus["REJECTED"] = "Rejected";
})(DamageReportStatus || (exports.DamageReportStatus = DamageReportStatus = {}));
let BookDamageReport = class BookDamageReport {
};
exports.BookDamageReport = BookDamageReport;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], BookDamageReport.prototype, "reportId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'IssueBook', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], BookDamageReport.prototype, "issueId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Book', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], BookDamageReport.prototype, "bookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Member', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], BookDamageReport.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: DamageReportReason, required: true }),
    __metadata("design:type", String)
], BookDamageReport.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], BookDamageReport.prototype, "bookAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], BookDamageReport.prototype, "fineAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], BookDamageReport.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: DamageReportStatus,
        default: DamageReportStatus.PENDING,
    }),
    __metadata("design:type", String)
], BookDamageReport.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], BookDamageReport.prototype, "reportDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], BookDamageReport.prototype, "processedDate", void 0);
exports.BookDamageReport = BookDamageReport = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BookDamageReport);
exports.BookDamageReportSchema = mongoose_1.SchemaFactory.createForClass(BookDamageReport);
exports.BookDamageReportSchema.index({ memberId: 1, status: 1 });
exports.BookDamageReportSchema.index({ bookId: 1, status: 1 });
exports.BookDamageReportSchema.index({ reportDate: -1 });
//# sourceMappingURL=book-damage-report.entity.js.map