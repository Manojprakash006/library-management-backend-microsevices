"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const notifications_controller_1 = require("./controller/notifications.controller");
const notifications_service_1 = require("./service/notifications.service");
const notifications_gateway_1 = require("./gateway/notifications.gateway");
const email_service_1 = require("./service/email.service");
const redis_subscriber_service_1 = require("./service/redis-subscriber.service");
const notification_entity_1 = require("./entities/notification.entity");
const member_entity_1 = require("../members/entities/member.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const web_push_service_1 = require("./service/web-push.service");
const push_subscription_schema_1 = require("./schema/push-subscription.schema");
const library_config_entity_1 = require("../contact/entities/library-config.entity");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            axios_1.HttpModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'defaultsecret',
                signOptions: { expiresIn: '24h' },
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: notification_entity_1.Notification.name, schema: notification_entity_1.NotificationSchema },
                { name: member_entity_1.Member.name, schema: member_entity_1.MemberSchema },
                { name: user_entity_1.User.name, schema: user_entity_1.UserSchema },
                { name: push_subscription_schema_1.PushSubscription.name, schema: push_subscription_schema_1.PushSubscriptionSchema },
                { name: library_config_entity_1.LibraryConfig.name, schema: library_config_entity_1.LibraryConfigSchema },
            ]),
        ],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService, notifications_gateway_1.NotificationsGateway, email_service_1.EmailService, redis_subscriber_service_1.RedisSubscriberService, web_push_service_1.WebPushService],
        exports: [notifications_service_1.NotificationsService, notifications_gateway_1.NotificationsGateway, email_service_1.EmailService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map