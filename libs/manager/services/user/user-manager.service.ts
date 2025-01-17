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
import { Course, User } from 'libs/manager/entities';
import { Brackets, In, Repository } from 'typeorm';
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
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
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
  async getUserById(id: string): Promise<UserCompleteResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new ServiceError(
          'User',
          'User not found',
          'User with provided id does not exist!',
          HttpStatus.NOT_FOUND,
        );
      }

      return this.mapper.map(user, User, UserCompleteResponseDto);
    } catch (error) {
      throw new ServiceError(
        'User',
        'Error While Fetching User!',
        error.message ?? 'Error While Fetching User!',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    image?: IFile,
  ): Promise<UserCompleteResponseDto> {
    try {
      // Find the existing user
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new ServiceError(
          'User',
          'User not found',
          'User with provided id does not exist!',
          HttpStatus.NOT_FOUND,
        );
      }

      // If email is being updated, check for duplicates
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingUser) {
          throw new ServiceError(
            'User',
            'Email already exists',
            'A user with this email already exists!',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // If password is being updated, hash it
      if (updateUserDto.password) {
        updateUserDto.password = await hash(updateUserDto.password, 10);
      }

      // Handle image upload if provided
      if (image) {
        // Note: Implement your file upload logic here
        // This is a placeholder for where you would:
        // 1. Upload the image to your storage
        // 2. Get the image URL
        // 3. Add it to updateUserDto
        // Example:
        // const imageUrl = await this.uploadService.uploadFile(image);
        // updateUserDto.imageUrl = imageUrl;
      }

      // Update the user
      await this.userRepository.update(id, {
        ...updateUserDto,
        updatedDate: new Date(),
      });

      // Fetch the updated user
      const updatedUser = await this.userRepository.findOne({
        where: { id },
      });

      // Map and return the updated user
      return this.mapper.map(updatedUser, User, UserCompleteResponseDto);
    } catch (error) {
      throw new ServiceError(
        'User',
        'Error While Updating User!',
        error.message ?? 'Error While Updating User!',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  lookup(
    userLookupDto: UserLookupDto,
    userData?: User,
  ): Promise<UserLookupResponseDto[]> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<Record<string, unknown>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new ServiceError(
          'User',
          'User not found',
          'User with provided id does not exist!',
          HttpStatus.NOT_FOUND,
        );
      }

      // Soft delete the user
      await this.userRepository.softDelete(id);

      return {
        status: HttpStatus.OK,
        message: 'User deleted successfully',
        id: id,
      };
    } catch (error) {
      throw new ServiceError(
        'User',
        'Error While Deleting User!',
        error.message ?? 'Error While Deleting User!',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  async assignCourses(userId: string, courseIds: string[]): Promise<User> {
    // Find the user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });

    if (!user) {
      throw new ServiceError(
        'User',
        `User with ID ${userId} not found`,
        `User with ID ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Find all courses
    const courses = await this.courseRepository.find({
      where: { id: In(courseIds) },
    });

    // Assign courses to user
    user.courses = user.courses || [];
    user.courses = [...user.courses, ...courses];

    // Save the updated user
    return await this.userRepository.save(user);
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
