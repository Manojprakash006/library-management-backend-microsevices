"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const config_module_1 = require("./config/config.module");
const members_module_1 = require("./modules/members/members.module");
const staff_module_1 = require("./modules/staff/staff.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const auth_module_1 = require("./modules/auth/auth.module");
const member_auth_module_1 = require("./modules/member-auth/member-auth.module");
const users_module_1 = require("./modules/users/users.module");
const member_history_module_1 = require("./modules/member-history/member-history.module");
const member_dashboard_module_1 = require("./modules/member-dashboard/member-dashboard.module");
const staff_dashboard_module_1 = require("./modules/staff-dashboard/staff-dashboard.module");
const activity_log_module_1 = require("./modules/activity-log/activity-log.module");
const admin_module_1 = require("./modules/admin/admin.module");
const library_visits_module_1 = require("./modules/library-visits/library-visits.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_members', {
                dbName: process.env.MONGODB_DB || 'library_members',
            }),
            members_module_1.MembersModule,
            staff_module_1.StaffModule,
            notifications_module_1.NotificationsModule,
            auth_module_1.AuthModule,
            member_auth_module_1.MemberAuthModule,
            users_module_1.UsersModule,
            member_history_module_1.MemberHistoryModule,
            member_dashboard_module_1.MemberDashboardModule,
            staff_dashboard_module_1.StaffDashboardModule,
            activity_log_module_1.ActivityLogModule,
            admin_module_1.AdminModule,
            library_visits_module_1.LibraryVisitsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map