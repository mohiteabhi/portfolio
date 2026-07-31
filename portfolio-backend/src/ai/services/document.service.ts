import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ParsedDocument } from '../interfaces/document.interface';
import { promises as fs } from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
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
  try {
    const buffer = await fs.readFile(filePath);

    const parser = new PDFParse({
      data: new Uint8Array(buffer),
    });

    const result = await parser.getText();

    await parser.destroy();

    return {
      fileName,
      extension: '.pdf',
      content: result.text,
    };
  } catch (error) {
    console.error('PDF ERROR =>', error);
    throw error;
  }
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