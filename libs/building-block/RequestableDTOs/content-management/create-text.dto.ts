import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTextDto {
  @ApiProperty({
    description: 'Title of the text',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description of the text',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
