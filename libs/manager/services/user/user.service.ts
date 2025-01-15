import { UserCompleteResponseDto } from 'libs/building-block/TransferableDTOs/user';
import { CreateUserDto } from 'libs/building-block/RequestableDTOs/user';
import { QueryUserDto } from 'libs/building-block/RequestableDTOs/user/query-user.dto';
import { PageDto } from 'libs/building-block/pagination/dto/page.dto';
import { UpdateUserDto } from 'libs/building-block/RequestableDTOs/user/update-user.dto';

import { User } from 'libs/manager/entities';

export abstract class IUserService {
  abstract create(
    userCreatePayload: CreateUserDto,
    user?: User,
  ): Promise<UserCompleteResponseDto>;
  abstract getAll(
    queryUserDto: QueryUserDto,
  ): Promise<PageDto<UserCompleteResponseDto>>;

  abstract userWithPassword(email: string): Promise<any | null>;

  abstract getUserByEmail(email: string): Promise<User>;
  abstract getUserById(id: string): Promise<any | null>;
  abstract update(id: string, data: UpdateUserDto): Promise<any | null>;

  abstract delete(id: string): Promise<Record<string, unknown>>;

  abstract forgetPassword(
    email: string,
    origin: string,
  ): Promise<Record<string, unknown>>;
}
