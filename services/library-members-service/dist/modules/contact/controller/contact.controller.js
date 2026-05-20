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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contact_service_1 = require("../service/contact.service");
const contact_message_dto_1 = require("../dto/contact-message.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const public_decorator_1 = require("../../../auth/guards/public.decorator");
let ContactController = class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
    }
    async sendMessage(createDto) {
        const result = await this.contactService.createMessage(createDto);
        return { message: 'Your message has been sent successfully', data: result };
    }
    async getMessages() {
        const result = await this.contactService.getAllMessages();
        return { message: 'Messages retrieved successfully', data: result };
    }
    async updateStatus(id, status) {
        const result = await this.contactService.updateMessageStatus(id, status);
        return { message: 'Status updated successfully', data: result };
    }
    async sendReply(id, replyMessage) {
        const result = await this.contactService.sendReply(id, replyMessage);
        return { message: 'Reply sent successfully via email', data: result };
    }
    async getLibraryInfo() {
        const result = await this.contactService.getLibraryConfig();
        return { message: 'Library info retrieved successfully', data: result };
    }
    async updateLibraryInfo(updateData) {
        const result = await this.contactService.updateLibraryConfig(updateData);
        return { message: 'Library info updated successfully', data: result };
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Post)('send'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message from contact us form' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_message_dto_1.CreateContactMessageDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('messages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all contact messages (Admin/Staff only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Patch)('status/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Update message status (Admin/Staff only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('reply/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Send email reply to visitor (Admin/Staff only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "sendReply", null);
__decorate([
    (0, common_1.Get)('info'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get library contact info and hours (Public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getLibraryInfo", null);
__decorate([
    (0, common_1.Patch)('info'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Update library contact info (Admin/Staff only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "updateLibraryInfo", null);
exports.ContactController = ContactController = __decorate([
    (0, swagger_1.ApiTags)('Contact Us'),
    (0, common_1.Controller)('contact'),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map