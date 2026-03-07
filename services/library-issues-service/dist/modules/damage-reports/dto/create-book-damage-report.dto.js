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
exports.UpdateBookDamageReportDto = exports.CreateBookDamageReportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const book_damage_report_entity_1 = require("../entities/book-damage-report.entity");
class CreateBookDamageReportDto {
}
exports.CreateBookDamageReportDto = CreateBookDamageReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique report identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookDamageReportDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Issue ID reference' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBookDamageReportDto.prototype, "issueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book ID reference' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBookDamageReportDto.prototype, "bookId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Member ID reference' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBookDamageReportDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for report', enum: book_damage_report_entity_1.DamageReportReason }),
    (0, class_validator_1.IsEnum)(book_damage_report_entity_1.DamageReportReason),
    __metadata("design:type", String)
], CreateBookDamageReportDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book amount', minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBookDamageReportDto.prototype, "bookAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fine amount', minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBookDamageReportDto.prototype, "fineAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount', minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBookDamageReportDto.prototype, "totalAmount", void 0);
class UpdateBookDamageReportDto {
}
exports.UpdateBookDamageReportDto = UpdateBookDamageReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report status', enum: book_damage_report_entity_1.DamageReportStatus, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(book_damage_report_entity_1.DamageReportStatus),
    __metadata("design:type", String)
], UpdateBookDamageReportDto.prototype, "status", void 0);
//# sourceMappingURL=create-book-damage-report.dto.js.map