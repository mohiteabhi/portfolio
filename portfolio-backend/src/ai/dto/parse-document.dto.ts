import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ParseDocumentDto {
  @ApiProperty({
    example: '1753972450112-123456789.pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileName!: string;
}