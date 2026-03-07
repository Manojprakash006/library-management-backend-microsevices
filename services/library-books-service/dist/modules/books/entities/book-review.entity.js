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
exports.BookReviewSchema = exports.BookReview = exports.ReviewStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PUBLISHED"] = "Published";
    ReviewStatus["DRAFT"] = "Draft";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
let BookReview = class BookReview {
};
exports.BookReview = BookReview;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Book' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BookReview.prototype, "bookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Member' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BookReview.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 5 }),
    __metadata("design:type", Number)
], BookReview.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 200 }),
    __metadata("design:type", String)
], BookReview.prototype, "reviewTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, minlength: 10, maxlength: 2000 }),
    __metadata("design:type", String)
], BookReview.prototype, "review", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BookReview.prototype, "recommended", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ReviewStatus, default: ReviewStatus.PUBLISHED }),
    __metadata("design:type", String)
], BookReview.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], BookReview.prototype, "reviewDate", void 0);
exports.BookReview = BookReview = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BookReview);
exports.BookReviewSchema = mongoose_1.SchemaFactory.createForClass(BookReview);
exports.BookReviewSchema.index({ bookId: 1, memberId: 1 }, { unique: true });
exports.BookReviewSchema.index({ memberId: 1, reviewDate: -1 });
exports.BookReviewSchema.index({ bookId: 1, status: 1 });
//# sourceMappingURL=book-review.entity.js.map