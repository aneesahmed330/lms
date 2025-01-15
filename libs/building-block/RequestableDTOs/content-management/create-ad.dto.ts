import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IFile } from 'libs/building-block/Interfaces/file.interface';

export class CreateAdDto {
  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  image?: IFile;

  @ApiPropertyOptional({
    description: 'Url of the ad',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  url?: string;

  @ApiProperty({
    description: 'Start Date of the ad (YYYY-MM-DD, 2024-05-24)',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'End Date of the ad( YYYY-MM-DD, 2024-05-24)',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
