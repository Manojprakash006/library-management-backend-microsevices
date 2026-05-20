export declare class CreateShiftDto {
    name: string;
    startTime: string;
    endTime: string;
    gracePeriod?: number;
    lunchDuration?: number;
    teaBreakDuration?: number;
    maxBreaks?: number;
}
export declare class UpdateShiftDto {
    name?: string;
    startTime?: string;
    endTime?: string;
    gracePeriod?: number;
    lunchDuration?: number;
    teaBreakDuration?: number;
    maxBreaks?: number;
    isActive?: boolean;
}
