import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { DocumentService } from './document.service';
import { SplitterService } from './splitter.service';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';

@Injectable()
export class IndexService {
  private readonly logger = new Logger(IndexService.name);

  constructor(
    private readonly documentService: DocumentService,

    private readonly splitterService: SplitterService,

    private readonly embeddingService: EmbeddingService,

    private readonly vectorStoreService: VectorStoreService,
  ) { }

  async indexDocument(fileName: string) {
    try {
      const document =
        await this.documentService.loadDocument(fileName);

      const chunks =
        await this.splitterService.split(document);

      const embeddings =
        await this.embeddingService.embedChunks(chunks);

      await this.vectorStoreService.store(
        embeddings,
      );

      return {
        success: true,

        indexedChunks: embeddings.length,

        message: 'Document indexed successfully',
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Failed to index document.',
      );
    }
  }

  async collectionInfo() {
    return await this.vectorStoreService.getCollectionInfo();
  }
}