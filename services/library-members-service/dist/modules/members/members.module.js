"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("@nestjs/axios");
const members_controller_1 = require("./controller/members.controller");
const members_service_1 = require("./service/members.service");
const member_entity_1 = require("./entities/member.entity");
const activity_log_module_1 = require("../activity-log/activity-log.module");
let MembersModule = class MembersModule {
};
exports.MembersModule = MembersModule;
exports.MembersModule = MembersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: member_entity_1.Member.name, schema: member_entity_1.MemberSchema }]),
            axios_1.HttpModule,
            activity_log_module_1.ActivityLogModule,
        ],
        controllers: [members_controller_1.MembersController],
        providers: [members_service_1.MembersService],
        exports: [members_service_1.MembersService],
    })
], MembersModule);
//# sourceMappingURL=members.module.js.map