"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveManagementModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const leave_management_controller_1 = require("./controller/leave-management.controller");
const leave_management_service_1 = require("./service/leave-management.service");
const leave_request_entity_1 = require("./entities/leave-request.entity");
let LeaveManagementModule = class LeaveManagementModule {
};
exports.LeaveManagementModule = LeaveManagementModule;
exports.LeaveManagementModule = LeaveManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: leave_request_entity_1.LeaveRequest.name, schema: leave_request_entity_1.LeaveRequestSchema }]),
        ],
        controllers: [leave_management_controller_1.LeaveManagementController],
        providers: [leave_management_service_1.LeaveManagementService],
        exports: [leave_management_service_1.LeaveManagementService],
    })
], LeaveManagementModule);
//# sourceMappingURL=leave-management.module.js.map