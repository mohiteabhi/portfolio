import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class IndexDocumentDto {
  @ApiProperty({
    example:
      '1785531116434-603823107.pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileName!: string;
}