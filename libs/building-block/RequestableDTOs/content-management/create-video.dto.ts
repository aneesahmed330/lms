import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({
    description: 'Key of the video',
  })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({
    description: 'name of the video',
  })
  @IsNotEmpty()
  @IsString()
  originalName: string;

  @ApiProperty({
    description: 'Title of the video',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;
}
