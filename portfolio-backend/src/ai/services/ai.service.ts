import { Injectable } from '@nestjs/common';
import { Express } from 'express';
@Injectable()
export class AiService {
    getHealth(){
        return {
            success: true,
            service: 'Portfolio AI backend',
            status: 'Running',
            timestamp: new Date().toISOString(),
        }
    }
}
