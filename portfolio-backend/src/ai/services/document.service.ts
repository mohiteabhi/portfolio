import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ParsedDocument } from '../interfaces/document.interface';
import { promises as fs } from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse');
import * as mammoth from 'mammoth';
@Injectable()
export class DocumentService {
    async loadDocument(fileName: string): Promise<ParsedDocument> {
        try {
            const filePath = path.join(
                process.cwd(),
                'uploads',
                'documents',
                fileName,
            );

            const extension = path.extname(fileName).toLowerCase();

            switch (extension) {
                case '.txt':
                case '.md':
                    return await this.readText(filePath, fileName);

                case '.pdf':
                    return await this.readPdf(filePath, fileName);

                case '.docx':
                    return await this.readDocx(filePath, fileName);

                default:
                    throw new BadRequestException('Unsupported document type.');
            }
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to read uploaded document.',
            );
        }
    }
    private async readText(
        filePath: string,
        fileName: string,
    ): Promise<ParsedDocument> {
        const content = await fs.readFile(filePath, 'utf8');

        return {
            fileName,
            extension: path.extname(fileName),
            content,
        };
    }

    private async readPdf(
        filePath: string,
        fileName: string,
    ): Promise<ParsedDocument> {
        const buffer = await fs.readFile(filePath);

        const pdf = await pdfParse(buffer);

        return {
            fileName,
            extension: '.pdf',
            content: pdf.text,
        };
    }

    private async readDocx(
    filePath: string,
    fileName: string,
  ): Promise<ParsedDocument> {
    const result = await mammoth.extractRawText({
      path: filePath,
    });

    return {
      fileName,
      extension: '.docx',
      content: result.value,
    };
  }


}