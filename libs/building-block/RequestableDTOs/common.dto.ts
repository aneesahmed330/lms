import { IsUUID, IsArray, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UUIDArrayDto {
  @ApiProperty({
    description: 'IDs for array',
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  ids: string[];
}

export class BooleanDto {
  @ApiProperty({
    description: 'Boolean',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  value: boolean;
}

export class ImageFileDto {
  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  file: any;
}

export class MultipleImageFileDto {
  @ApiPropertyOptional({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  headerImage: any;

  @ApiPropertyOptional({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  homeImage: any;
}
