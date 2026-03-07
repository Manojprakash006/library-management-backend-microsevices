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
exports.MemberAuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const member_entity_1 = require("../../members/entities/member.entity");
let MemberAuthService = class MemberAuthService {
    constructor(memberModel, jwtService) {
        this.memberModel = memberModel;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, name, phone } = registerDto;
        const existingMember = await this.memberModel.findOne({ email });
        if (existingMember) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const member = new this.memberModel({
            email,
            password: hashedPassword,
            name,
            phone,
            role: 'member',
            status: 'active',
        });
        await member.save();
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
        const member = await this.memberModel.findOne({ email });
        if (!member) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, member.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
};
exports.MemberAuthService = MemberAuthService;
exports.MemberAuthService = MemberAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], MemberAuthService);
//# sourceMappingURL=member-auth.service.js.map