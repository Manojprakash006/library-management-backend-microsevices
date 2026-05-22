import { UploadService } from '../service/upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): Promise<{
        message: string;
        data: {
            originalName: string;
            filename: string;
            size: number;
            mimetype: string;
            url: string;
        };
    }>;
}
