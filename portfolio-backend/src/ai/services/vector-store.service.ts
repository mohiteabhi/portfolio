import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    OnModuleInit,
} from '@nestjs/common';

import { ChromaClient } from 'chromadb';
import { CHROMA_CLIENT, CHROMA_COLLECTION } from '../../common/constants/chroma.constants';
import { EmbeddedChunk } from '../interfaces/embedding.interface';

@Injectable()
export class VectorStoreService implements OnModuleInit {
    private readonly logger = new Logger(VectorStoreService.name);

    constructor(
        @Inject(CHROMA_CLIENT)
        private readonly chroma: ChromaClient,
    ) { }

    async onModuleInit() {
        try {
            await this.getCollection();

            this.logger.log('Connected to ChromaDB');
        } catch (error) {
            this.logger.error('Failed to connect to ChromaDB', error);

            throw error;
        }
    }

    private async getCollection() {
        return await this.chroma.getOrCreateCollection({
            name: CHROMA_COLLECTION,
            embeddingFunction: undefined,
        });
    }
    async store(chunks: EmbeddedChunk[]) {
        try {
            const collection = await this.getCollection();

            await collection.add({
                ids: chunks.map((chunk) => chunk.id),

                documents: chunks.map((chunk) => chunk.content),

                embeddings: chunks.map((chunk) => chunk.embedding),

                metadatas: chunks.map((chunk) => ({
                    source: chunk.metadata.source,
                    chunkIndex: chunk.metadata.chunkIndex,
                })),
            });

            this.logger.log(`${chunks.length} chunks stored successfully.`);

            return true;
        } catch (error) {
            this.logger.error(error);

            throw new InternalServerErrorException(
                'Failed to store vectors.',
            );
        }
    }

    async getCollectionInfo() {
        try {
            const collection = await this.getCollection();

            return {
                name: collection.name,
                totalVectors: await collection.count(),
            };
        } catch (error) {
            this.logger.error(error);

            throw new InternalServerErrorException(
                'Failed to fetch collection information.',
            );
        }
    }
}