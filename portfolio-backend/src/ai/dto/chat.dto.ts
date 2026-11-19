import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
} from 'class-validator';

import { Transform } from 'class-transformer'

export class ChatDto {

    @ApiProperty({
        example: 'Does Abhijeet know Angular?',
        maxLength: 1000,
    })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, {
        message: 'Question must not contain only whitespace.',
    })
    @MaxLength(1000)
    question!: string;

    @ApiPropertyOptional({
        example: 'portfolio-user-123',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Matches(/^[A-Za-z0-9_-]+$/, {
        message:
            'Session ID may contain only letters, numbers, hyphens, and underscores.',
    })
    sessionId!: string;
}