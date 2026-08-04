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
import { SearchResult } from '../interfaces/search-result.interface';

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

                    storedFileName: chunk.metadata.storedFileName,

                    chunkIndex: chunk.metadata.chunkIndex,

                    documentType: chunk.metadata.documentType,

                    uploadedAt: chunk.metadata.uploadedAt,
                }))
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

    async search(
        embedding: number[],
        limit = 5,
    ) {
        try {
            const collection =
                await this.getCollection();

            const result =
                await collection.query({
                    queryEmbeddings: [embedding],
                    nResults: limit,
                    include: [
                        'documents',
                        'metadatas',
                        'distances',
                    ],
                });

            const matches: SearchResult[] =
                result.ids[0].map((id, index) => {

                    const metadata = result.metadatas?.[0]?.[index] as any;

                    return {

                        id,

                        content:
                            result.documents?.[0]?.[index] ?? '',

                        distance:
                            result.distances?.[0]?.[index] ?? 0,

                        source: metadata?.source ?? '',

                        storedFileName:
                            metadata?.storedFileName ?? '',

                        chunkIndex:
                            metadata?.chunkIndex ?? 0,

                        documentType:
                            metadata?.documentType ?? '',

                        uploadedAt:
                            metadata?.uploadedAt ?? '',
                    };
                });

            return {
                success: true,

                totalMatches: matches.length,

                matches,
            };
        } catch (error) {
            this.logger.error(error);

            throw new InternalServerErrorException(
                'Failed to search vectors.',
            );
        }
    }

    async clearCollection() {
        try {
            await this.chroma.deleteCollection({
                name: CHROMA_COLLECTION,
            });

            await this.getCollection();

            this.logger.log(`Collection "${CHROMA_COLLECTION}" cleared successfully.`);

            return {
                success: true,
                message: 'Collection cleared successfully.',
            };
        } catch (error) {
            this.logger.error(error);

            throw new InternalServerErrorException(
                'Failed to clear collection.',
            );
        }
    }
}