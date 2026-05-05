"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteModule = void 0;
const common_1 = require("@nestjs/common");
const favourite_service_1 = require("./service/favourite.service");
const favourite_controller_1 = require("./controller/favourite.controller");
const mongoose_1 = require("@nestjs/mongoose");
const favourite_entity_1 = require("./entities/favourite.entity");
const book_entity_1 = require("./shared/book.entity");
const axios_1 = require("@nestjs/axios");
let FavouriteModule = class FavouriteModule {
};
exports.FavouriteModule = FavouriteModule;
exports.FavouriteModule = FavouriteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: favourite_entity_1.Favourite.name, schema: favourite_entity_1.FavouriteSchema },
                { name: book_entity_1.Book.name, schema: book_entity_1.BookSchema },
            ]),
            axios_1.HttpModule,
        ],
        controllers: [favourite_controller_1.FavouriteController],
        providers: [favourite_service_1.FavouriteService],
    })
], FavouriteModule);
//# sourceMappingURL=favourite.module.js.map