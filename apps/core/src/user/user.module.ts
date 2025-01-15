import { ManagerModule } from 'libs/manager';
import { AuthModule } from '@app/modules/auth/auth.module';
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';

@Module({
  imports: [ManagerModule, AuthModule],
  controllers: [UserController],
})
export class UserModule {}
