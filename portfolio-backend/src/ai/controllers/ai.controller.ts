import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from '../services/ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

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
}
