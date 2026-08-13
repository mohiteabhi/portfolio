import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsOptional,
    IsString,
} from 'class-validator';

export class ChatDto {

    @ApiProperty({
        example: 'Does Abhijeet know Angular?',
    })
    @IsString()
    question!: string;

    @ApiPropertyOptional({
        example: 'portfolio-user-123',
    })
    @IsOptional()
    @IsString()
    sessionId?: string;
}