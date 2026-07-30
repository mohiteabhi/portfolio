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

@Module({
  controllers: [AiController],
  providers: [AiService, UploadService, GeminiProvider, ChatService, DocumentService, FileEmbeddingService, PromptService, SplitterService, VectorStoreService],
})
export class AiModule {}
