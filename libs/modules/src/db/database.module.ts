import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Password,
  Audited,
  SocketEntity,
  Course,
  Lecture,
  File,
  Notification,
} from 'libs/manager/entities';

const databaseProviders = [
  TypeOrmModule.forFeature([
    Audited,
    User,
    Password,
    Course,
    Lecture,
    File,
    SocketEntity,
    Notification,
  ]),
];

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
