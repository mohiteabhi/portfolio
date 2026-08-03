import { Module } from '@nestjs/common';
import { AiService } from './services/ai.service';
import { AiController } from './controllers/ai.controller';
import { UploadService } from './services/upload.service';
import { GeminiProvider } from './providers/gemini.provider';
import { ChatService } from './services/chat.service';
import { DocumentService } from './services/document.service';
import { FileEmbeddingService } from './services/file-embedding.service';
import { PromptService } from './services/prompt.service';
import { SplitterService } from './services/splitter.service';
import { VectorStoreService } from './services/vector-store.service';
import { EmbeddingService } from './services/embedding.service';
import { IndexService } from './services/index.service';
import { ChromaProvider } from './providers/chroma.provider';

@Module({
  controllers: [AiController],
  providers: [AiService, UploadService, GeminiProvider, ChatService, DocumentService, FileEmbeddingService, PromptService, SplitterService, VectorStoreService, EmbeddingService, IndexService, ChromaProvider],
})
export class AiModule {}
