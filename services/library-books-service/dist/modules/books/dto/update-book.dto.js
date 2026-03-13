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
exports.UpdateBookDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const book_entity_1 = require("../entities/book.entity");
class UpdateBookDto {
}
exports.UpdateBookDto = UpdateBookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book title', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book author', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Publisher name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "publisher", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Year of publication', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(new Date().getFullYear() + 1),
    __metadata("design:type", Number)
], UpdateBookDto.prototype, "publishYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book category', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Edition information', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "edition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book language', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of pages', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateBookDto.prototype, "pages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book price', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateBookDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rack number where book is stored', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "rackNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shelf number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "shelfNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of book', enum: book_entity_1.BookType, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(book_entity_1.BookType),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "bookType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book condition', enum: book_entity_1.BookCondition, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(book_entity_1.BookCondition),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book status', enum: book_entity_1.BookStatus, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(book_entity_1.BookStatus),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity available', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateBookDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cover image URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "coverUrl", void 0);
//# sourceMappingURL=update-book.dto.js.map