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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../entities/user.entity");
const activity_log_service_1 = require("../../activity-log/service/activity-log.service");
let AuthService = class AuthService {
    constructor(userModel, jwtService, activityLogService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.activityLogService = activityLogService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email }).select('+password').exec();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({ id: user._id, role: user.role });
        if (user.role === 'admin') {
            await this.activityLogService.logAction({
                adminId: user._id.toString(),
                action: 'ADMIN_LOGIN',
                entityType: 'AUTH',
                entityId: user._id.toString(),
                details: { email: user.email }
            });
        }
        return {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        };
    }
    async register(registerDto) {
        const { name, email, password, role } = registerDto;
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const user = await this.userModel.create({ name, email, password, role });
        const token = this.jwtService.sign({ id: user._id, role: user.role });
        return {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        };
    }
    async refreshToken() {
        return { message: 'Refresh token not implemented' };
    }
    async logout() {
        return { message: 'Logged out' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        activity_log_service_1.ActivityLogService])
], AuthService);
//# sourceMappingURL=auth.service.js.map