import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from 'libs/building-block/pagination/dto/page-options.dto';

export class QueryUserDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'search user by name',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'search user by email',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Sort Column value i.e name',
  })
  @IsIn(['email', 'firstName'])
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  sortCol?: string;
}
