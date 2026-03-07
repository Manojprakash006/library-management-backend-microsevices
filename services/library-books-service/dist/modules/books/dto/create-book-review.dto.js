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
exports.CreateBookReviewDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const book_review_entity_1 = require("../entities/book-review.entity");
const class_validator_2 = require("class-validator");
class CreateBookReviewDto {
}
exports.CreateBookReviewDto = CreateBookReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBookReviewDto.prototype, "bookId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Member ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBookReviewDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rating (1-5)', minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateBookReviewDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Review title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateBookReviewDto.prototype, "reviewTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Review text' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateBookReviewDto.prototype, "review", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the book is recommended', default: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBookReviewDto.prototype, "recommended", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Review status', enum: book_review_entity_1.ReviewStatus, default: book_review_entity_1.ReviewStatus.PUBLISHED, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_2.IsEnum)(book_review_entity_1.ReviewStatus),
    __metadata("design:type", String)
], CreateBookReviewDto.prototype, "status", void 0);
//# sourceMappingURL=create-book-review.dto.js.map