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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfigController = void 0;
const common_1 = require("@nestjs/common");
const system_config_service_1 = require("../service/system-config.service");
const update_system_config_dto_1 = require("../dto/update-system-config.dto");
const swagger_1 = require("@nestjs/swagger");
let SystemConfigController = class SystemConfigController {
    constructor(configService) {
        this.configService = configService;
    }
    async getConfig() {
        return await this.configService.getConfig();
    }
    async updateConfig(dto) {
        return await this.configService.updateConfig(dto);
    }
};
exports.SystemConfigController = SystemConfigController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get system configuration' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemConfigController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update system configuration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_system_config_dto_1.UpdateSystemConfigDto]),
    __metadata("design:returntype", Promise)
], SystemConfigController.prototype, "updateConfig", null);
exports.SystemConfigController = SystemConfigController = __decorate([
    (0, swagger_1.ApiTags)('System Config'),
    (0, common_1.Controller)('system-config'),
    __metadata("design:paramtypes", [system_config_service_1.SystemConfigService])
], SystemConfigController);
//# sourceMappingURL=system-config.controller.js.map