import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFooterContentDto {
  @ApiPropertyOptional({
    description: 'footer email of the Content',
  })
  @IsString()
  @IsOptional()
  footerEmail?: string;

  @ApiPropertyOptional({
    description: 'footer mobile number of the Content',
  })
  @IsString()
  @IsOptional()
  footerMobileNumber?: string;

  @ApiPropertyOptional({
    description: 'footer url of the Content',
  })
  @IsString()
  @IsOptional()
  footerUrl?: string;

  @ApiPropertyOptional({
    description: 'image url of the Content',
  })
  @IsString()
  @IsOptional()
  image?: string;
}
