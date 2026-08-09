import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';
import { QueryService } from './query.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorStoreService: VectorStoreService,
    private readonly queryService: QueryService
  ) { }

  async search(question: string) {
    try {
      const normalizedQuestion =
        this.queryService.normalize(question);
      const embedding =
        await this.embeddingService.embedQuery(normalizedQuestion);

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