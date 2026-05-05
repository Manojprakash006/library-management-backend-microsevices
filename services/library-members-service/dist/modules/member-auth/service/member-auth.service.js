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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberAuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const member_entity_1 = require("../../members/entities/member.entity");
const email_service_1 = require("../../notifications/service/email.service");
let MemberAuthService = class MemberAuthService {
    constructor(memberModel, jwtService, emailService) {
        this.memberModel = memberModel;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async register(registerDto) {
        const { email, password, name, phone, address } = registerDto;
        console.log("log from member auth service for registerDto :", registerDto);
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new common_1.ConflictException('Valid email is required');
        }
        if (!password || password.length < 6) {
            throw new common_1.ConflictException('Password must be at least 6 characters');
        }
        if (!name || name.trim().length < 2) {
            throw new common_1.ConflictException('Name is required and must be at least 2 characters');
        }
        const existingMember = await this.memberModel.findOne({ email });
        if (existingMember) {
            throw new common_1.ConflictException('Email already registered');
        }
        const member = new this.memberModel({
            email,
            password: password,
            name,
            phoneNumber: phone,
            role: 'member',
            status: 'active',
            address,
        });
        await member.save();
        console.log("register log :", member.save());
        const token = this.jwtService.sign({
            userId: member._id,
            email: member.email,
            role: 'member',
        });
        return {
            token,
            user: {
                id: member._id,
                email: member.email,
                name: member.name,
                role: 'member',
            },
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const member = await this.memberModel.findOne({ email }).select('+password');
        if (!member) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!member.password) {
            throw new common_1.UnauthorizedException('Account error - password not set');
        }
        try {
            const isPasswordValid = await bcrypt.compare(password, member.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Password verification failed');
        }
        const token = this.jwtService.sign({
            userId: member._id,
            email: member.email,
            role: 'member',
        });
        return {
            token,
            user: {
                id: member._id,
                email: member.email,
                name: member.name,
                role: 'member',
            },
        };
    }
    async getProfile(userId) {
        const member = await this.memberModel.findById(userId).select('-password');
        if (!member) {
            throw new common_1.UnauthorizedException('Member not found');
        }
        return member;
    }
    async forgotPassword(email) {
        const member = await this.memberModel.findOne({ email });
        if (!member) {
            throw new common_1.UnauthorizedException('Email not found');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        member.resetPasswordToken = tokenHash;
        member.resetPasswordExpires = new Date(Date.now() + 3600000);
        await member.save();
        await this.emailService.sendPasswordResetEmail(member.email, member.name, resetToken);
        return {
            message: 'Password reset instructions sent to email',
        };
    }
    async resetPassword(token, newPassword) {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const member = await this.memberModel.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!member) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        if (!newPassword || newPassword.length < 6) {
            throw new common_1.ConflictException('Password must be at least 6 characters');
        }
        member.password = newPassword;
        member.resetPasswordToken = undefined;
        member.resetPasswordExpires = undefined;
        await member.save();
        return {
            message: 'Password reset successfully',
        };
    }
};
exports.MemberAuthService = MemberAuthService;
exports.MemberAuthService = MemberAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, email_service_1.EmailService])
], MemberAuthService);
//# sourceMappingURL=member-auth.service.js.map