import { AutoMap } from '@automapper/classes';
import { UserRole } from 'libs/building-block/constants';

export class UserCompleteResponseDto {
  @AutoMap()
  id: string;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  email: string;

  @AutoMap()
  userRole: UserRole;
}

export class UserWithPasswordDto extends UserCompleteResponseDto {
  @AutoMap()
  password: string;
}
