import { Controller, Get, Post, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from '../services/ai.service';
import { UploadService } from '../services/upload.service';
import { UploadResponseDto } from '../dto/upload-response.dto';
import { multerOptions } from 'src/common/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body } from '@nestjs/common';
import { ParseDocumentDto } from '../dto/parse-document.dto';
import { IndexDocumentDto } from '../dto/index-document.dto';
import { SearchDto } from '../dto/search.dto';

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


  @Post('parse')
  @ApiOperation({
    summary: 'Parse uploaded document into chunks',
  })
  @ApiResponse({
    status: 200,
  })
  parse(
    @Body() dto: ParseDocumentDto,
  ) {
    return this.aiService.parseDocument(dto.fileName);
  }

  @Post('index')
  @ApiOperation({
    summary:
      'Generate embeddings from document',
  })
  async index(
    @Body()
    dto: IndexDocumentDto,
  ) {
    return await this.aiService.indexDocument(
      dto.fileName,
      dto.originalName,
    );
  }


  @Get('collection-info')
  async collectionInfo() {
    return await this.aiService.collectionInfo();
  }

  @Post('search')
  @ApiOperation({
    summary: 'Semantic search',
  })
  search(
    @Body()
    dto: SearchDto,
  ) {
    return this.aiService.search(
      dto.question,
    );
  }

  @Delete('clear-collection')
  @ApiOperation({
    summary: 'Clear the vector store collection',
  })
  clearCollection() {
    return this.aiService.clearCollection();
  }
}
