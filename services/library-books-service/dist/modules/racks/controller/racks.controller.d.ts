import { RacksService } from '../service/racks.service';
import { RackDto } from '../dto/rack.dto';
export declare class RacksController {
    private readonly racksService;
    constructor(racksService: RacksService);
    findAll(): Promise<{
        message: string;
        data: RackDto[];
        count: number;
    }>;
    findOne(rackNumber: string): Promise<{
        message: string;
        data: RackDto;
    }>;
}
