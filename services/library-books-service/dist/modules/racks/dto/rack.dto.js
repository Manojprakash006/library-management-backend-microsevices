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
exports.RackDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RackDto {
}
exports.RackDto = RackDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rack number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RackDto.prototype, "rackNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location in library' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RackDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total books in rack' }),
    __metadata("design:type", Number)
], RackDto.prototype, "totalBooks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available books count' }),
    __metadata("design:type", Number)
], RackDto.prototype, "available", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Issued books count' }),
    __metadata("design:type", Number)
], RackDto.prototype, "issued", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rack capacity' }),
    __metadata("design:type", Number)
], RackDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Capacity percentage', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RackDto.prototype, "capacityPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Books in rack', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RackDto.prototype, "books", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recent books summary', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RackDto.prototype, "recentBooks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Books grouped by category', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], RackDto.prototype, "booksByCategory", void 0);
//# sourceMappingURL=rack.dto.js.map