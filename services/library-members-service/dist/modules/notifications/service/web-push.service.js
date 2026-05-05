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
var WebPushService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPushService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const webpush = require("web-push");
let WebPushService = WebPushService_1 = class WebPushService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(WebPushService_1.name);
    }
    onModuleInit() {
        const publicKey = this.configService.get('VAPID_PUBLIC_KEY');
        const privateKey = this.configService.get('VAPID_PRIVATE_KEY');
        const email = this.configService.get('VAPID_EMAIL', 'mailto:admin@example.com');
        if (publicKey && privateKey) {
            webpush.setVapidDetails(email, publicKey, privateKey);
            this.logger.log('VAPID details set successfully');
        }
        else {
            this.logger.warn('VAPID keys not found. Web Push will not work.');
        }
    }
    async sendNotification(subscription, payload) {
        try {
            await webpush.sendNotification(subscription, JSON.stringify(payload));
            this.logger.log(`Push notification sent successfully`);
        }
        catch (error) {
            this.logger.error(`Error sending push notification: ${error.message}`);
            if (error.statusCode === 410 || error.statusCode === 404) {
                return { shouldDelete: true };
            }
        }
        return { shouldDelete: false };
    }
};
exports.WebPushService = WebPushService;
exports.WebPushService = WebPushService = WebPushService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], WebPushService);
//# sourceMappingURL=web-push.service.js.map