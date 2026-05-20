"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffDashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("@nestjs/axios");
const staff_dashboard_controller_1 = require("./controller/staff-dashboard.controller");
const staff_dashboard_service_1 = require("./service/staff-dashboard.service");
const member_entity_1 = require("../members/entities/member.entity");
const staff_entity_1 = require("../staff/entities/staff.entity");
const library_visit_entity_1 = require("../library-visits/entities/library-visit.entity");
const activity_log_module_1 = require("../activity-log/activity-log.module");
let StaffDashboardModule = class StaffDashboardModule {
};
exports.StaffDashboardModule = StaffDashboardModule;
exports.StaffDashboardModule = StaffDashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: member_entity_1.Member.name, schema: member_entity_1.MemberSchema },
                { name: staff_entity_1.Staff.name, schema: staff_entity_1.StaffSchema },
                { name: library_visit_entity_1.LibraryVisit.name, schema: library_visit_entity_1.LibraryVisitSchema },
            ]),
            axios_1.HttpModule,
            activity_log_module_1.ActivityLogModule,
        ],
        controllers: [staff_dashboard_controller_1.StaffDashboardController],
        providers: [staff_dashboard_service_1.StaffDashboardService],
        exports: [staff_dashboard_service_1.StaffDashboardService],
    })
], StaffDashboardModule);
//# sourceMappingURL=staff-dashboard.module.js.map