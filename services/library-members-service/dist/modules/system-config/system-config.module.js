"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfigModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const system_config_entity_1 = require("./entities/system-config.entity");
const system_config_service_1 = require("./service/system-config.service");
const system_config_controller_1 = require("./controller/system-config.controller");
let SystemConfigModule = class SystemConfigModule {
};
exports.SystemConfigModule = SystemConfigModule;
exports.SystemConfigModule = SystemConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: system_config_entity_1.SystemConfig.name, schema: system_config_entity_1.SystemConfigSchema }]),
        ],
        providers: [system_config_service_1.SystemConfigService],
        controllers: [system_config_controller_1.SystemConfigController],
        exports: [system_config_service_1.SystemConfigService],
    })
], SystemConfigModule);
//# sourceMappingURL=system-config.module.js.map