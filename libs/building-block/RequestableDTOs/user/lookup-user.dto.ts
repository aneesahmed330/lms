import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'libs/building-block/constants';

export class UserLookupDto {
  @ApiPropertyOptional({
    description: 'search user by name or email',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  query?: string;

  @ApiPropertyOptional({
    description: 'search user by role',
  })
  @IsOptional()
  @IsEnum(UserRole, { each: true })
  userRole?: UserRole[];
}
