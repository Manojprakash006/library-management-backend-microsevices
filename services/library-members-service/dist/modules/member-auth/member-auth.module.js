"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberAuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const member_auth_controller_1 = require("./controller/member-auth.controller");
const member_auth_service_1 = require("./service/member-auth.service");
const member_entity_1 = require("../members/entities/member.entity");
let MemberAuthModule = class MemberAuthModule {
};
exports.MemberAuthModule = MemberAuthModule;
exports.MemberAuthModule = MemberAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: member_entity_1.Member.name, schema: member_entity_1.MemberSchema }]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'defaultsecret',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [member_auth_controller_1.MemberAuthController],
        providers: [member_auth_service_1.MemberAuthService],
        exports: [member_auth_service_1.MemberAuthService],
    })
], MemberAuthModule);
//# sourceMappingURL=member-auth.module.js.map