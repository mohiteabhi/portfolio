import { Module } from '@nestjs/common';
import { AiService } from './services/ai.service';
import { AiController } from './controllers/ai.controller';
import { UploadService } from './services/upload.service';

@Module({
  controllers: [AiController],
  providers: [AiService, UploadService],
})
export class AiModule {}
