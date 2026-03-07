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
exports.MemberAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const member_auth_service_1 = require("../service/member-auth.service");
const member_register_dto_1 = require("../dto/member-register.dto");
const member_login_dto_1 = require("../dto/member-login.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let MemberAuthController = class MemberAuthController {
    constructor(memberAuthService) {
        this.memberAuthService = memberAuthService;
    }
    async register(registerDto) {
        const result = await this.memberAuthService.register(registerDto);
        return { message: 'Member registered successfully', data: result };
    }
    async login(loginDto) {
        const result = await this.memberAuthService.login(loginDto);
        return { message: 'Login successful', data: result };
    }
    async getProfile(req) {
        const result = await this.memberAuthService.getProfile(req.user.userId);
        return { message: 'Profile retrieved successfully', data: result };
    }
};
exports.MemberAuthController = MemberAuthController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new member' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Member registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [member_register_dto_1.MemberRegisterDto]),
    __metadata("design:returntype", Promise)
], MemberAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Member login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [member_login_dto_1.MemberLoginDto]),
    __metadata("design:returntype", Promise)
], MemberAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('member'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get member profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberAuthController.prototype, "getProfile", null);
exports.MemberAuthController = MemberAuthController = __decorate([
    (0, swagger_1.ApiTags)('Member Auth'),
    (0, common_1.Controller)('member-auth'),
    __metadata("design:paramtypes", [member_auth_service_1.MemberAuthService])
], MemberAuthController);
//# sourceMappingURL=member-auth.controller.js.map