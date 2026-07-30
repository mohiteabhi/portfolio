import { GoogleGenAI } from '@google/genai';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Express } from 'express';
import { GEMINI_CLIENT } from 'src/common/constants/ai.constants';
@Injectable()
export class AiService {

    constructor(
        @Inject(GEMINI_CLIENT)
        private readonly gemini: GoogleGenAI,
    ){}

    getHealth(){
        return {
            success: true,
            service: 'Portfolio AI backend',
            status: 'Running',
            timestamp: new Date().toISOString(),
        }
    }

    async testLLM(){
        try{
            const response = await this.gemini.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'Reply only with: Gemini connection successful.',
            });
            return{
                success: true,
                response: response.text,
            };
        }
        catch(error){
            console.error(error);
            throw new InternalServerErrorException('Failed to connect to Gemini', );
        }
    }
}
