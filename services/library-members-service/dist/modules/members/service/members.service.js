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
var MembersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const member_entity_1 = require("../entities/member.entity");
let MembersService = MembersService_1 = class MembersService {
    constructor(memberModel) {
        this.memberModel = memberModel;
        this.logger = new common_1.Logger(MembersService_1.name);
    }
    async create(createMemberDto) {
        const existingMember = await this.memberModel.findOne({ memberId: createMemberDto.memberId }).exec();
        if (existingMember) {
            throw new common_1.ConflictException('Member ID already exists');
        }
        const existingEmail = await this.memberModel.findOne({ email: createMemberDto.email }).exec();
        if (existingEmail) {
            throw new common_1.ConflictException('Email already registered');
        }
        const createdMember = new this.memberModel(createMemberDto);
        return createdMember.save();
    }
    async findAll() {
        return this.memberModel.find().select('-password').exec();
    }
    async findOne(id) {
        const member = await this.memberModel.findById(id).select('-password').exec();
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        return member;
    }
    async findByMemberId(memberId) {
        const member = await this.memberModel.findOne({ memberId }).select('-password').exec();
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        return member;
    }
    async update(id, updateData) {
        const member = await this.memberModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password').exec();
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        return member;
    }
    async remove(id) {
        const result = await this.memberModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Member not found');
        }
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = MembersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MembersService);
//# sourceMappingURL=members.service.js.map