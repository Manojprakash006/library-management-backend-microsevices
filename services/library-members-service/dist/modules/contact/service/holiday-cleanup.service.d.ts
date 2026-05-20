import { Model } from 'mongoose';
import { LibraryConfigDocument } from '../entities/library-config.entity';
export declare class HolidayCleanupService {
    private libraryConfigModel;
    constructor(libraryConfigModel: Model<LibraryConfigDocument>);
    resetExpiredHoliday(): Promise<void>;
}
