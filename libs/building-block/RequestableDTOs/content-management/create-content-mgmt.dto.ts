import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { CreateAdDto } from './create-ad.dto';
import { CreateTextDto } from './create-text.dto';
import { CreateVideoDto } from './create-video.dto';
import { CreateSponsorDto } from './create-sponsor.dto';

export class CreateContentManagementDto {
  @ApiProperty({
    description: 'Banner Image key of the Content',
  })
  @IsNotEmpty()
  @IsString()
  bannerImage: string;

  @ApiProperty({
    description: 'Banner url of the Content',
  })
  @IsNotEmpty()
  @IsString()
  bannerURl: string;

  @ApiProperty({
    description: 'Footer of the Content',
  })
  @IsNotEmpty()
  @IsString()
  footer: string;

  @ApiProperty({
    description: 'promotion id of the content',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  promotionId?: string;
}

export class CreateContentManagementDtoWithOtherEntites extends CreateContentManagementDto {
  @ApiProperty({
    description: 'Array of Ads data for the content',
    type: [CreateAdDto],
  })
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAdDto)
  ads?: CreateAdDto[];

  @ApiProperty({
    description: 'Array of Videos data for the content',
    type: [CreateVideoDto],
  })
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateVideoDto)
  videos?: CreateVideoDto[];

  @ApiProperty({
    description: 'Array of Sponsors associated with the content',
    type: [CreateSponsorDto],
  })
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSponsorDto)
  sponsors?: CreateSponsorDto[];

  @ApiProperty({
    description: 'Array of Texts associated with the content',
    type: [CreateTextDto],
  })
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTextDto)
  texts?: CreateTextDto[];
}
