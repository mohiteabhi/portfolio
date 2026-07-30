import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    example: '1753972450112-123456789.pdf',
  })
  fileName!: string;

  @ApiProperty({
    example: 'Resume.pdf',
  })
  originalName!: string;

  @ApiProperty({
    example: 'application/pdf',
  })
  mimeType!: string;

  @ApiProperty({
    example: 254321,
  })
  size!: number;
}