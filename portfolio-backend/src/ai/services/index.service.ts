import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { DocumentService } from './document.service';
import { SplitterService } from './splitter.service';
import { EmbeddingService } from './embedding.service';

@Injectable()
export class IndexService {
  private readonly logger = new Logger(IndexService.name);

  constructor(
    private readonly documentService: DocumentService,

    private readonly splitterService: SplitterService,

    private readonly embeddingService: EmbeddingService,
  ) {}

  async indexDocument(fileName: string) {
    try {
      const document =
        await this.documentService.loadDocument(fileName);

      const chunks =
        await this.splitterService.split(document);

      const embeddings =
        await this.embeddingService.embedChunks(chunks);

      return {
        success: true,

        totalChunks: embeddings.length,

        chunks: embeddings.map((chunk) => ({
          id: chunk.id,

          preview: chunk.content.substring(0, 100),

          embeddingDimension:
            chunk.embedding.length,
        })),
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Failed to index document.',
      );
    }
  }
}