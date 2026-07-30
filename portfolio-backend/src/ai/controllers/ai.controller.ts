import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from '../services/ai.service';
import { UploadService } from '../services/upload.service';
import { UploadResponseDto } from '../dto/upload-response.dto';
import { multerOptions } from 'src/common/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService, private readonly uploadService: UploadService) { }

  @Get('health')
  @ApiOperation({
    summary: 'Health Check',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is running',
  })
  getHealth() {
    return this.aiService.getHealth();
  }

  @Post('upload')
  @ApiOperation({
    summary: 'Upload portfolio document',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: UploadResponseDto,
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  upload(@UploadedFile() file: any) {
    return this.uploadService.upload(file);
  }

  @Get('test-llm')
  @ApiOperation({
    summary: 'Test Gemini connection',
  })
  @ApiResponse({
    status: 200,
  })
  async testLLM() {
    return await this.aiService.testLLM();
  }
}
