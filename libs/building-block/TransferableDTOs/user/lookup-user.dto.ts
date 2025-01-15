import { AutoMap } from '@automapper/classes';

export class UserLookupResponseDto {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;
}
