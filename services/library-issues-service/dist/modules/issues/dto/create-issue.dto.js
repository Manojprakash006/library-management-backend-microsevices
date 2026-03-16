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
exports.CreateIssueDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const issue_book_entity_1 = require("../entities/issue-book.entity");
class CreateIssueDto {
}
exports.CreateIssueDto = CreateIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Book ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "bookId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Member ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Issue type', enum: issue_book_entity_1.IssueType }),
    (0, class_validator_1.IsEnum)(issue_book_entity_1.IssueType),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "issueType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of days to issue (only for Taking Home)', minimum: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateIssueDto.prototype, "numberOfDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Issue date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateIssueDto.prototype, "issueDate", void 0);
//# sourceMappingURL=create-issue.dto.js.map