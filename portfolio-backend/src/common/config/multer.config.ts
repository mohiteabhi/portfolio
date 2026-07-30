import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import {extname} from 'path';

const allowedExtensions = ['.pdf', '.docx', '.txt', '.md'];

export const multerOptions = {
    storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, callback) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

            callback(null, uniqueName + extname(file.originalname));
        },
    }),

    limits: {
        fileSize: 10*1024*1024 //10MB
    },

    fileFilter: (req: any, file: any, callback: any) => {
        const extension = extname(file.originalname).toLocaleLowerCase();

        if(!allowedExtensions.includes(extension)){
            return callback(
                new BadRequestException(
                    'Only PDF, DOCX, TXT, and MD files are allowed.',
                ),
                false,
            );
        }
        callback(null, true);
    },
}
