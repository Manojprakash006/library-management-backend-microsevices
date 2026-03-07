import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File) {
    return {
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${file.filename}`,
    };
  }
}
