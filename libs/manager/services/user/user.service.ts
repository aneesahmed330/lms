import { UserCompleteResponseDto } from 'libs/building-block/TransferableDTOs/user';
import { CreateUserDto } from 'libs/building-block/RequestableDTOs/user';
import { QueryUserDto } from 'libs/building-block/RequestableDTOs/user/query-user.dto';
import { PageDto } from 'libs/building-block/pagination/dto/page.dto';
import { UpdateUserDto } from 'libs/building-block/RequestableDTOs/user/update-user.dto';

import { Course, User } from 'libs/manager/entities';
import { CreatePasswordDto } from 'libs/building-block/RequestableDTOs/user/create-password.dto';
import { UserLookupDto } from 'libs/building-block/RequestableDTOs/user/lookup-user.dto';
import { UserLookupResponseDto } from 'libs/building-block/TransferableDTOs/user/lookup-user.dto';

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

  abstract createPassword(
    body: CreatePasswordDto,
  ): Promise<Record<string, unknown>>;
  abstract forgetPassword(
    email: string,
    origin: string,
  ): Promise<Record<string, unknown>>;

  abstract lookup(
    userLookupDto: UserLookupDto,
    userData?: User,
  ): Promise<UserLookupResponseDto[]>;

  abstract assignCourses(userId: string, courseIds: string[]): Promise<User>;
  abstract getCoursesByUserId(userId: string): Promise<Course[]>;

  abstract resetVisitorId(userId: string): Promise<UserCompleteResponseDto>;
}
