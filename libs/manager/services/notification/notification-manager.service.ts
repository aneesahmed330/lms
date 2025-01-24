import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ServiceError } from 'libs/building-block/filters/service-error';
import { Notification, User } from 'libs/manager/entities';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from 'libs/building-block/RequestableDTOs/notification';

@Injectable()
export class NotificationManagerService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      const users = await this.userRepository.find({
        where: {
          id: In(createNotificationDto.userIds),
        },
      });

      const notification = this.notificationRepository.create({
        text: createNotificationDto.text,
        users: users,
      });
      return await this.notificationRepository.save(notification);
    } catch (error) {
      throw new ServiceError(
        'Notification',
        'Error while creating notification!',
        error.message || 'An error occurred while creating the notification.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        relations: ['users'],
      });
    } catch (error) {
      throw new ServiceError(
        'Notification',
        'Error while fetching notifications!',
        error.message || 'An error occurred while fetching the notifications.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    try {
      return await this.notificationRepository
        .createQueryBuilder('notification')
        .innerJoinAndSelect('notification.users', 'user')
        .where('user.id = :userId', { userId })
        .getMany();
    } catch (error) {
      throw new ServiceError(
        'Notification',
        'Error while fetching user notifications!',
        error.message || 'An error occurred while fetching the notifications.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!notification) {
        throw new ServiceError(
          'Notification',
          'Notification not found!',
          `No notification found with ID ${id}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return notification;
    } catch (error) {
      throw new ServiceError(
        'Notification',
        'Error while fetching notification!',
        error.message || 'An error occurred while fetching the notification.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!notification) {
        throw new ServiceError(
          'Notification',
          'Notification not found!',
          `No notification found with ID ${id}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (updateNotificationDto.text) {
        notification.text = updateNotificationDto.text;
      }

      if (updateNotificationDto.userIds) {
        const users = await this.userRepository.find({
          where: {
            id: In(updateNotificationDto.userIds),
          },
        });

        notification.users = users;
      }

      return await this.notificationRepository.save(notification);
    } catch (error) {
      throw new ServiceError(
        'Notification',
        'Error while updating notification!',
        error.message || 'An error occurred while updating the notification.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id },
      });

      if (!notification) {
        throw new ServiceError(
          'Notification',
          'Notification not found!',
          `No notification found with ID ${id}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.notificationRepository.remove(notification);
    } catch (error) {
      throw new ServiceError(
        'Notification',
        'Error while deleting notification!',
        error.message || 'An error occurred while deleting the notification.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
