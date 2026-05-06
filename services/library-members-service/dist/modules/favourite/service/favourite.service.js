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
exports.FavouriteService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const favourite_entity_1 = require("../entities/favourite.entity");
const mongoose_2 = require("mongoose");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
let FavouriteService = class FavouriteService {
    constructor(favouriteModel, httpService) {
        this.favouriteModel = favouriteModel;
        this.httpService = httpService;
    }
    async toggleFavourite(userId, bookId) {
        const existing = await this.favouriteModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            bookId: new mongoose_2.Types.ObjectId(bookId),
        });
        if (existing) {
            await this.favouriteModel.deleteOne({ _id: existing._id });
            return { status: 'removed', bookId };
        }
        await this.favouriteModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            bookId: new mongoose_2.Types.ObjectId(bookId),
        });
        return { status: 'added', bookId };
    }
    async getFavourites(userId) {
        try {
            const favourites = await this.favouriteModel.find({ userId: new mongoose_2.Types.ObjectId(userId) });
            const booksServiceUrl = 'http://library-api-gateway:3000/library/books';
            const enrichedFavourites = await Promise.all(favourites.map(async (fav) => {
                try {
                    const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${booksServiceUrl}/books/${fav.bookId}`));
                    return { ...fav.toObject(), book: response.data?.data };
                }
                catch (err) {
                    console.log("BOOK FETCH FAILED:", err.message);
                    return { ...fav.toObject(), book: null };
                }
            }));
            return enrichedFavourites;
        }
        catch (error) {
            console.log('FAILED TO FETCH FAVOURITES:', error.message);
            return [];
        }
    }
};
exports.FavouriteService = FavouriteService;
exports.FavouriteService = FavouriteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(favourite_entity_1.Favourite.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService])
], FavouriteService);
//# sourceMappingURL=favourite.service.js.map