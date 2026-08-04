import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @ApiProperty({
    example: 'Tell me about Abhijeet\'s Angular experience.',
  })
  @IsString()
  @IsNotEmpty()
  question!: string;
}