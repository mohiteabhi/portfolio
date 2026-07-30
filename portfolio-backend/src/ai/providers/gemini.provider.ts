import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

import { GEMINI_CLIENT } from '../../common/constants/ai.constants';

export const GeminiProvider: Provider = {
    provide: GEMINI_CLIENT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('GEMINI_API_KEY');

        if(!apiKey){
            throw new Error('GEMINI_API_KEY is missing.')
        }
        return new GoogleGenAI({
            apiKey,
        })
    }
    
}