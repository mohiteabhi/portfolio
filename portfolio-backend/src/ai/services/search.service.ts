import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  async search(question: string) {
    try {
      const embedding =
        await this.embeddingService.embedQuery(question);

      return await this.vectorStoreService.search(
        embedding,
      );
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Failed to search documents.',
      );
    }
  }

  
}