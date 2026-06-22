export declare class UploadService {
    uploadFile(file: Express.Multer.File): Promise<{
        originalName: string;
        filename: string;
        size: number;
        mimetype: string;
        url: string;
    }>;
}
