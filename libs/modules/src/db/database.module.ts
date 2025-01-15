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
  ]),
];

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
