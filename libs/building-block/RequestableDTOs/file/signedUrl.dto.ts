import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignedUrlDto {
  @ApiProperty({
    description: 'name of the file',
  })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'Type of the file',
  })
  @IsNotEmpty()
  @IsString()
  mimeType: string;
}
