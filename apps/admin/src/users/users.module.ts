import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ManagerModule } from 'libs/manager';

@Module({
  imports: [ManagerModule],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}
