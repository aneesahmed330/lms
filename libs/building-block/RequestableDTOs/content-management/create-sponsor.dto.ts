import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSponsorDto {
  @ApiProperty({
    description: 'URL of the sponsor',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  url?: string;

  @ApiProperty({
    description: 'Image file of the sponsor',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: any;
}
