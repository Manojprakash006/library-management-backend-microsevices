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
exports.UpdateNotificationDto = exports.CreateNotificationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const notification_entity_1 = require("../entities/notification.entity");
class CreateNotificationDto {
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Member ID reference' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Issue ID reference', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "issueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification type', enum: notification_entity_1.NotificationType }),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification message' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
class UpdateNotificationDto {
}
exports.UpdateNotificationDto = UpdateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Read status', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationDto.prototype, "isRead", void 0);
//# sourceMappingURL=create-notification.dto.js.map