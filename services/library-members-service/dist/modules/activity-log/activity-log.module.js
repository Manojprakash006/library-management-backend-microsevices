"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const activity_log_controller_1 = require("./controller/activity-log.controller");
const activity_log_service_1 = require("./service/activity-log.service");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const staff_entity_1 = require("../staff/entities/staff.entity");
const member_entity_1 = require("../members/entities/member.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let ActivityLogModule = class ActivityLogModule {
};
exports.ActivityLogModule = ActivityLogModule;
exports.ActivityLogModule = ActivityLogModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: activity_log_entity_1.ActivityLog.name, schema: activity_log_entity_1.ActivityLogSchema },
                { name: staff_entity_1.Staff.name, schema: staff_entity_1.StaffSchema },
                { name: member_entity_1.Member.name, schema: member_entity_1.MemberSchema },
                { name: user_entity_1.User.name, schema: user_entity_1.UserSchema },
            ]),
        ],
        controllers: [activity_log_controller_1.ActivityLogController],
        providers: [activity_log_service_1.ActivityLogService],
        exports: [activity_log_service_1.ActivityLogService],
    })
], ActivityLogModule);
//# sourceMappingURL=activity-log.module.js.map