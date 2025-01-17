/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserCompleteResponseDto,
  UserWithPasswordDto,
} from 'libs/building-block/TransferableDTOs';
import { UserLookupResponseDto } from 'libs/building-block/TransferableDTOs/user/lookup-user.dto';
import { User } from 'libs/manager/entities';
import { Brackets, Repository } from 'typeorm';
import { IUserService } from './user.service';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import { PageDto } from 'libs/building-block/pagination/dto/page.dto';
import { CreateUserDto } from 'libs/building-block/RequestableDTOs';

import { CreatePasswordDto } from 'libs/building-block/RequestableDTOs/user/create-password.dto';
import { UserLookupDto } from 'libs/building-block/RequestableDTOs/user/lookup-user.dto';
import { QueryUserDto } from 'libs/building-block/RequestableDTOs/user/query-user.dto';
import { UpdateUserDto } from 'libs/building-block/RequestableDTOs/user/update-user.dto';
import { ServiceError } from 'libs/building-block/filters/service-error';

import { hash } from 'bcryptjs';
import { UserRole } from 'libs/building-block/constants';
import { PageOptionsDto } from 'libs/building-block/pagination/dto/page-options.dto';
import { PageMetaDto } from 'libs/building-block/pagination/dto/page-meta.dto';

@Injectable()
export class UserManagerService
  extends AutomapperProfile
  implements IUserService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(mapper);
  }

  async create(
    userCreatePayload: CreateUserDto,
  ): Promise<UserCompleteResponseDto> {
    try {
      const _user = await this.userRepository.findOne({
        where: { email: userCreatePayload.email },
      });

      if (_user) {
        throw new ServiceError(
          'UserService',
          'User with email already exist!',
          'User with email already exist!',
          HttpStatus.BAD_REQUEST,
        );
      }

      if ('password' in userCreatePayload) {
        const hashPassword = await hash(userCreatePayload.password, 10);
        userCreatePayload.password = hashPassword;
      }

      const user = this.userRepository.create(userCreatePayload);
      const res = await this.userRepository.save(user);
      return this.mapper.map(res, User, UserCompleteResponseDto);
    } catch (error) {
      throw new ServiceError(
        'User',
        'Error While Creating User!',
        error.message ?? 'Error While Creating User!',
        error.status ?? 500,
      );
    }
  }
  async userWithPassword(email: string) {
    try {
      const res = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      if (!res) {
        throw new ServiceError(
          'User',
          'User not found',
          'Error While Fetching User!',
          404,
        );
      }

      return res;
    } catch (error) {
      throw new ServiceError(
        'User',
        'Error While Fetching User with password!',
        error.message ?? 'Error While Fetching User with password!',
        error.status ?? 500,
      );
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getAll(
    queryUserDto: QueryUserDto,
  ): Promise<PageDto<UserCompleteResponseDto>> {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .where({ userRole: UserRole.Student });

      if (queryUserDto.email) {
        queryBuilder.where({
          email: queryUserDto.email,
        });
      }

      if (queryUserDto.name) {
        const nameCondition = new Brackets((qb) => {
          qb.where('user.firstName ILIKE :name', {
            name: `%${queryUserDto.name.toLowerCase()}%`,
          }).orWhere('user.lastName ILIKE :name', {
            name: `%${queryUserDto.name.toLowerCase()}%`,
          });
        });

        queryBuilder.andWhere(nameCondition);
      }

      //uncomment in case for sort column also make changes in dto
      if (queryUserDto.sortCol) {
        queryBuilder.orderBy(
          `user.${queryUserDto.sortCol}`,
          queryUserDto.order,
        );
      } else {
        queryBuilder.orderBy(`user.createdDate`, 'DESC');
      }

      queryBuilder.skip(queryUserDto.skip).take(queryUserDto.take);
      const pageOptionsDto: PageOptionsDto = {
        order: queryUserDto?.order,
        page: queryUserDto?.page,
        take: queryUserDto?.take,
        skip: queryUserDto.skip,
      };

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      const data = this.mapper.mapArray(
        entities,
        User,
        UserCompleteResponseDto,
      );

      return new PageDto(data, pageMetaDto);
    } catch (error) {
      throw new ServiceError(
        'User',
        'Error While Fetching Users!',
        error.message ?? 'Error While Fetching Users!',
        error.status ?? 500,
      );
    }
  }

  // -----------------------
  getUserById(id: string): Promise<any | null> {
    throw new Error('Method not implemented.');
  }
  update(id: string, data: UpdateUserDto, image?: IFile): Promise<any | null> {
    throw new Error('Method not implemented.');
  }

  lookup(
    userLookupDto: UserLookupDto,
    userData?: User,
  ): Promise<UserLookupResponseDto[]> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<Record<string, unknown>> {
    throw new Error('Method not implemented.');
  }
  createPassword(body: CreatePasswordDto): Promise<Record<string, unknown>> {
    throw new Error('Method not implemented.');
  }
  forgetPassword(
    email: string,
    origin: string,
  ): Promise<Record<string, unknown>> {
    throw new Error('Method not implemented.');
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, User, UserCompleteResponseDto);
      createMap(mapper, User, UserLookupResponseDto);
      createMap(mapper, User, UserWithPasswordDto);
    };
  }

  //-----
}
