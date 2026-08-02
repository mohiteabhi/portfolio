import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { GoogleGenAI } from '@google/genai';

import { GEMINI_CLIENT } from '../../common/constants/ai.constants';

import { DocumentChunk } from '../interfaces/chunk.interface';
import { EmbeddedChunk } from '../interfaces/embedding.interface';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(
    @Inject(GEMINI_CLIENT)
    private readonly gemini: GoogleGenAI,
  ) {}

  async embedChunks(
    chunks: DocumentChunk[],
  ): Promise<EmbeddedChunk[]> {
    try {
      const embeddedChunks: EmbeddedChunk[] = [];

      for (const chunk of chunks) {
        
        const response = await this.gemini.models.embedContent({
          model: 'text-embedding-004',

          contents: [chunk.content],
        });

        const embeddingValues = response.embeddings?.values ?? response.embeddings?.[0]?.values;
        if (!embeddingValues) {
          throw new Error(`Failed to extract embedding values for chunk ID: ${chunk.id}`);
        }
        embeddedChunks.push({
          ...chunk,
          embedding: embeddingValues
        });
      }

      return embeddedChunks;
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Failed to generate embeddings.',
      );
    }
  }
}