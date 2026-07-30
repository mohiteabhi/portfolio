import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
    upload(file: any) {
        return {
            success: true,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
        };
    }
}