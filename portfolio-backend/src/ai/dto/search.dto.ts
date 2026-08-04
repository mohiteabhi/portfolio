import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchDto {
  @ApiProperty({
    example: 'Does Abhijeet know Angular?',
  })
  @IsString()
  @IsNotEmpty()
  question!: string;
}