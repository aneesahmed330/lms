import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthModule } from '@app/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
})
export class AuthenticationModule {}
