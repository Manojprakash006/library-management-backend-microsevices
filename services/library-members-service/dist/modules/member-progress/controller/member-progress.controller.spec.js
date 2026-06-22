"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const member_progress_controller_1 = require("./member-progress.controller");
describe('MemberProgressController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [member_progress_controller_1.MemberProgressController],
        }).compile();
        controller = module.get(member_progress_controller_1.MemberProgressController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=member-progress.controller.spec.js.map