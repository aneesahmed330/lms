import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IFile } from 'libs/building-block/Interfaces/file.interface';

export class UpdateContentImageDto {
  @ApiProperty({
    description: 'Name of the shop image Key promotion configuration',
  })
  @IsOptional()
  @IsString()
  shopImageName?: string;

  @ApiProperty({
    description: 'shop image key promotion configuration',
  })
  @IsOptional()
  @IsString()
  shopImageKey?: string;

  @ApiProperty({
    description: 'Name of the announcement image Key promotion configuration',
  })
  @IsOptional()
  @IsString()
  announcementImageName?: string;

  @ApiProperty({
    description: 'announcement image key promotion configuration',
  })
  @IsOptional()
  @IsString()
  announcementImageKey?: string;

  @ApiProperty({
    description: 'Name of the report image Key promotion configuration',
  })
  @IsOptional()
  @IsString()
  reportImageName?: string;

  @ApiProperty({
    description: 'report image key promotion configuration',
  })
  @IsOptional()
  @IsString()
  reportImageKey?: string;

  @ApiProperty({
    description: 'Name of the rules image Key promotion configuration',
  })
  @IsOptional()
  @IsString()
  rulesImageName?: string;

  @ApiProperty({
    description: 'rules Image key promotion configuration',
  })
  @IsOptional()
  @IsString()
  rulesImageKey?: string;

  @ApiProperty({
    description: 'Name of the leaderboard image Key promotion configuration',
  })
  @IsOptional()
  @IsString()
  leaderboardImageName?: string;

  @ApiProperty({
    description: 'leaderboard key promotion configuration',
  })
  @IsOptional()
  @IsString()
  leaderboardImageKey?: string;

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
}
