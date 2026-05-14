"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const book_requests_controller_1 = require("./controller/book-requests.controller");
const book_requests_service_1 = require("./service/book-requests.service");
const book_request_entity_1 = require("./entities/book-request.entity");
let BookRequestsModule = class BookRequestsModule {
};
exports.BookRequestsModule = BookRequestsModule;
exports.BookRequestsModule = BookRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: book_request_entity_1.BookRequest.name, schema: book_request_entity_1.BookRequestSchema },
            ]),
        ],
        controllers: [book_requests_controller_1.BookRequestsController],
        providers: [book_requests_service_1.BookRequestsService],
        exports: [book_requests_service_1.BookRequestsService],
    })
], BookRequestsModule);
//# sourceMappingURL=book-requests.module.js.map