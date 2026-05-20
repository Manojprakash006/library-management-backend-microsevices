"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const favourite_controller_1 = require("./favourite.controller");
describe('FavouriteController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [favourite_controller_1.FavouriteController],
        }).compile();
        controller = module.get(favourite_controller_1.FavouriteController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=favourite.controller.spec.js.map