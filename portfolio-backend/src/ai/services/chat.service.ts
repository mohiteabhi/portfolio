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
import {
  SIMILARITY_THRESHOLD,
} from '../../common/constants/search.constants';

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

      this.logger.log(
        `Retrieved ${searchResult.totalMatches} chunks.`,
      );

      searchResult.matches.forEach((chunk) => {
        this.logger.log(
          `[${chunk.distance.toFixed(3)}] ${chunk.source} | Chunk ${chunk.chunkIndex}`,
        );
      });
      const relevantChunks = searchResult.matches.filter(
        (chunk) => chunk.distance <= SIMILARITY_THRESHOLD,
      );
      if (relevantChunks.length === 0) {
        return {
          success: true,
          answer:
            "I couldn't find any information about that in Abhijeet's portfolio.",
          sources: [],
        };
      }

      this.logger.log(
        `Using ${relevantChunks.length} chunks after similarity filtering.`,
      );

      /**
       * Build prompt
       */
      const prompt =
        this.promptBuilder.build(
          question,
          relevantChunks,
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
            relevantChunks.map((chunk) => [
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