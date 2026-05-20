"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const member_progress_service_1 = require("./member-progress.service");
describe('MemberProgressService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [member_progress_service_1.MemberProgressService],
        }).compile();
        service = module.get(member_progress_service_1.MemberProgressService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=member-progress.service.spec.js.map