import { FinesService } from '../service/fines.service';
import { PayFineDto } from '../dto/pay-fine.dto';
export declare class FinesController {
    private readonly finesService;
    constructor(finesService: FinesService);
    getFinesByMemberId(memberId: string): Promise<import("../entities/fine.entity").Fine[]>;
    getFineById(id: string): Promise<import("../entities/fine.entity").Fine>;
    payFine(id: string, payFineDto: PayFineDto): Promise<import("../entities/fine.entity").Fine>;
}
