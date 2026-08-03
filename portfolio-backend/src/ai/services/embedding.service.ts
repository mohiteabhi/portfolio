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
  ) { }

async embedChunks(
  chunks: DocumentChunk[],
): Promise<EmbeddedChunk[]> {
  try {
    const embeddedChunks: EmbeddedChunk[] = [];

    for (const chunk of chunks) {
      const embedding = await this.generateEmbedding(
        chunk.content,
      );

      embeddedChunks.push({
        ...chunk,
        embedding,
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

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.gemini.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
    });

    if (
      !response.embeddings?.length ||
      !response.embeddings[0].values
    ) {
      throw new Error('No embedding returned by Gemini.');
    }

    return response.embeddings[0].values;
  }

  async embedQuery(question: string): Promise<number[]> {
  try {
    return await this.generateEmbedding(question);
  } catch (error) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Failed to generate query embedding.',
    );
  }
}

}