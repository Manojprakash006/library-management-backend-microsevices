"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const favourite_service_1 = require("./favourite.service");
describe('FavouriteService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [favourite_service_1.FavouriteService],
        }).compile();
        service = module.get(favourite_service_1.FavouriteService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=favourite.service.spec.js.map