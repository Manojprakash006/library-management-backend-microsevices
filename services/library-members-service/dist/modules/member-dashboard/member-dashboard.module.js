"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberDashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const member_dashboard_controller_1 = require("./controller/member-dashboard.controller");
const member_dashboard_service_1 = require("./service/member-dashboard.service");
const member_entity_1 = require("../members/entities/member.entity");
let MemberDashboardModule = class MemberDashboardModule {
};
exports.MemberDashboardModule = MemberDashboardModule;
exports.MemberDashboardModule = MemberDashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: member_entity_1.Member.name, schema: member_entity_1.MemberSchema }]),
        ],
        controllers: [member_dashboard_controller_1.MemberDashboardController],
        providers: [member_dashboard_service_1.MemberDashboardService],
        exports: [member_dashboard_service_1.MemberDashboardService],
    })
], MemberDashboardModule);
//# sourceMappingURL=member-dashboard.module.js.map