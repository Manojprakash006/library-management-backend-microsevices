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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const util_service_1 = require("../service/util.service");
let UtilController = class UtilController {
    constructor(utilService) {
        this.utilService = utilService;
    }
    async healthCheck() {
        const result = await this.utilService.healthCheck();
        return { message: 'Health check completed', data: result };
    }
    async ping() {
        return { message: 'Pong', timestamp: new Date().toISOString() };
    }
    async clearAll() {
        const result = await this.utilService.clearAll();
        return result;
    }
};
exports.UtilController = UtilController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UtilController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)('ping'),
    (0, swagger_1.ApiOperation)({ summary: 'Ping service' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UtilController.prototype, "ping", null);
__decorate([
    (0, common_1.Delete)('clear-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all products' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UtilController.prototype, "clearAll", null);
exports.UtilController = UtilController = __decorate([
    (0, swagger_1.ApiTags)('Util'),
    (0, common_1.Controller)('util'),
    __metadata("design:paramtypes", [util_service_1.UtilService])
], UtilController);
//# sourceMappingURL=util.controller.js.map