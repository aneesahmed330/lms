import { Role } from 'libs/manager/entities/role.entity';
import { AutoMap } from '@automapper/classes';

export class PermissionResponseDto {
  @AutoMap()
  id: number;

  @AutoMap()
  role: Role;

  @AutoMap()
  module: string;

  @AutoMap()
  action: string;

  @AutoMap()
  isGranted: boolean;
}

export class RoleResponseDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;
}
