import { GoogleGenAI } from '@google/genai';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Express } from 'express';
import { GEMINI_CLIENT } from 'src/common/constants/ai.constants';
import { DocumentService } from './document.service';
import { SplitterService } from './splitter.service';

@Injectable()
export class AiService {

    constructor(
        @Inject(GEMINI_CLIENT)
        private readonly gemini: GoogleGenAI,
        private readonly documentService: DocumentService,

        private readonly splitterService: SplitterService,
    ) { }

    getHealth() {
        return {
            success: true,
            service: 'Portfolio AI backend',
            status: 'Running',
            timestamp: new Date().toISOString(),
        }
    }

    async testLLM() {
        try {
            const response = await this.gemini.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'Reply only with: Gemini connection successful.',
            });
            return {
                success: true,
                response: response.text,
            };
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to connect to Gemini',);
        }
    }

    async parseDocument(fileName: string) {
        try {
            const document = await this.documentService.loadDocument(fileName);

            const chunks = await this.splitterService.split(document);

            return {
                success: true,
                totalChunks: chunks.length,
                chunks,
            };
        } catch (error) {
            console.error(error);

            throw new InternalServerErrorException(
                'Failed to parse document.',
            );
        }
    }
}
