import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { GoogleGenAI } from '@google/genai';

import { GEMINI_CLIENT } from '../../common/constants/ai.constants';

import { SearchService } from './search.service';
import { PromptBuilderService } from './prompt-builder.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject(GEMINI_CLIENT)
    private readonly gemini: GoogleGenAI,

    private readonly searchService: SearchService,

    private readonly promptBuilder: PromptBuilderService,
  ) { }

  async chat(question: string) {
    try {
      /**
       * Retrieve relevant chunks
       */
      const searchResult =
        await this.searchService.search(question);
      this.logger.log(
        `Retrieved ${searchResult.totalMatches} chunks.`,
      );
      if (searchResult.totalMatches === 0) {
        return {
          success: true,
          answer:
            "I couldn't find any information about that in Abhijeet's portfolio.",
          sources: [],
        };
      }

      /**
       * Build prompt
       */
      const prompt =
        this.promptBuilder.build(
          question,
          searchResult.matches,
        );

      this.logger.log(`Question: ${question}`);
      /**
       * Generate answer
       */
      const response =
        await this.gemini.models.generateContent({
          model: 'gemini-2.5-flash',

          contents: prompt,
          config: {
            temperature: 0.2,
          },
        });
      this.logger.log('Answer generated successfully.');

      return {
        success: true,

        answer: response.text
          ?.replace(/^Answer:\s*/i, '')
          .replace(/```/g, '')
          .trim(),

        sources: [
          ...new Map(
            searchResult.matches.map((chunk) => [
              chunk.source,
              {
                source: chunk.source,
                documentType: chunk.documentType,
              },
            ]),
          ).values(),
        ],
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Failed to generate response.',
      );
    }
  }
}