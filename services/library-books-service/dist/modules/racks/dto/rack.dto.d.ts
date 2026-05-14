export declare class RackDto {
    rackNumber: string;
    location: string;
    totalBooks: number;
    available: number;
    issued: number;
    capacity: number;
    capacityPercentage?: string;
    books?: any[];
    recentBooks?: any[];
    booksByCategory?: Record<string, any[]>;
}
