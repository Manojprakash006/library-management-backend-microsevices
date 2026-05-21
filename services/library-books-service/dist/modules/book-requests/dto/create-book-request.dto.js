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
exports.UpdateBookRequestDto = exports.CreateBookRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const book_request_entity_1 = require("../entities/book-request.entity");
class CreateBookRequestDto {
}
exports.CreateBookRequestDto = CreateBookRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique request identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookRequestDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book ID reference' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBookRequestDto.prototype, "bookId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Member ID reference' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateBookRequestDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Request date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateBookRequestDto.prototype, "requestDate", void 0);
class UpdateBookRequestDto {
}
exports.UpdateBookRequestDto = UpdateBookRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Request status', enum: book_request_entity_1.BookRequestStatus }),
    (0, class_validator_1.IsEnum)(book_request_entity_1.BookRequestStatus),
    __metadata("design:type", String)
], UpdateBookRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currently borrowed count', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateBookRequestDto.prototype, "currentlyBorrowed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total history count', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateBookRequestDto.prototype, "totalHistory", void 0);
//# sourceMappingURL=create-book-request.dto.js.map