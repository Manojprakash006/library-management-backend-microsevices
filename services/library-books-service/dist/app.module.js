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
const config_module_1 = require("./config/config.module");
const library_config_module_1 = require("./modules/library-config/library-config.module");
const books_module_1 = require("./modules/books/books.module");
const book_requests_module_1 = require("./modules/book-requests/book-requests.module");
const racks_module_1 = require("./modules/racks/racks.module");
const reports_module_1 = require("./modules/reports/reports.module");
const member_books_module_1 = require("./modules/member-books/member-books.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const upload_module_1 = require("./modules/upload/upload.module");
const util_module_1 = require("./modules/util/util.module");
const redis_emitter_module_1 = require("./modules/redis-emitter/redis-emitter.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            library_config_module_1.LibraryConfigModule,
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_members', {
                dbName: process.env.MONGODB_DB || 'library_members',
            }),
            books_module_1.BooksModule,
            book_requests_module_1.BookRequestsModule,
            racks_module_1.RacksModule,
            reports_module_1.ReportsModule,
            member_books_module_1.MemberBooksModule,
            dashboard_module_1.DashboardModule,
            upload_module_1.UploadModule,
            util_module_1.UtilModule,
            redis_emitter_module_1.RedisEmitterModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map