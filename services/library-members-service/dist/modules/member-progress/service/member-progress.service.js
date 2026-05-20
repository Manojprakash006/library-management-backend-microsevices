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
var MemberProgressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberProgressService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let MemberProgressService = MemberProgressService_1 = class MemberProgressService {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(MemberProgressService_1.name);
    }
    async getSummary(memberId, authHeader) {
        try {
            const issuesService = process.env.ISSUES_SERVICE_URL ||
                'http://library-issues-service:3013';
            const paymentsService = process.env.PAYMENTS_SERVICE_URL ||
                'http://library-payments-service:3005';
            const requestsService = process.env.REQUESTS_SERVICE_URL ||
                'http://library-requests-service:3014';
            const issuedResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesService}/issues/member/${memberId}`, {
                headers: authHeader
                    ? { Authorization: authHeader }
                    : {},
            }));
            const issues = issuedResponse.data || [];
            const issuedBooks = issues.length;
            const returnedBooks = issues.filter((item) => item.status === 'Returned').length;
            const overdueBooks = issues.filter((item) => item.status !== 'Returned' &&
                item.daysOverdue > 0).length;
            const lostDamagedBooks = issues.filter((item) => item.condition === 'Lost' ||
                item.condition === 'Damaged').length;
            const renewedBooks = issues.filter((item) => item.renewCount > 0).length;
            let totalFinePaid = 0;
            try {
                const fineResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${paymentsService}/fines/member/${memberId}`, {
                    headers: authHeader
                        ? { Authorization: authHeader }
                        : {},
                }));
                const fines = fineResponse.data || [];
                totalFinePaid = fines
                    .filter((fine) => fine.status === 'PAID')
                    .reduce((sum, fine) => sum + (fine.amount || 0), 0);
            }
            catch (error) {
                this.logger.error(`Failed to fetch fine data: ${error.message}`);
            }
            return {
                booksIssued: issuedBooks,
                booksReturned: returnedBooks,
                renewedBooks,
                overdueBooks,
                finePaid: totalFinePaid,
                lostOrDamaged: lostDamagedBooks,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get member progress summary: ${error.message}`);
            throw error;
        }
    }
};
exports.MemberProgressService = MemberProgressService;
exports.MemberProgressService = MemberProgressService = MemberProgressService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], MemberProgressService);
//# sourceMappingURL=member-progress.service.js.map