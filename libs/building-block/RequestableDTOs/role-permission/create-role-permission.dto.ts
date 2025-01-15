import { AutoMap } from '@automapper/classes';
import { IsString, IsBoolean, IsNumberString } from 'class-validator';

export class CreatePermissionDto {
  @AutoMap()
  @IsString()
  module: string;

  @AutoMap()
  @IsString()
  action: string;

  @AutoMap()
  @IsBoolean()
  isGranted: boolean;

  @AutoMap()
  @IsNumberString()
  roleId?: string;
}

export class CreateRoleDto {
  @AutoMap()
  @IsString()
  name: string;
}
