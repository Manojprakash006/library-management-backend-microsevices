"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const member_history_controller_1 = require("./controller/member-history.controller");
const member_history_service_1 = require("./service/member-history.service");
const member_entity_1 = require("../members/entities/member.entity");
let MemberHistoryModule = class MemberHistoryModule {
};
exports.MemberHistoryModule = MemberHistoryModule;
exports.MemberHistoryModule = MemberHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: member_entity_1.Member.name, schema: member_entity_1.MemberSchema }]),
        ],
        controllers: [member_history_controller_1.MemberHistoryController],
        providers: [member_history_service_1.MemberHistoryService],
        exports: [member_history_service_1.MemberHistoryService],
    })
], MemberHistoryModule);
//# sourceMappingURL=member-history.module.js.map