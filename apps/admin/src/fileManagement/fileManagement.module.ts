import { Module } from '@nestjs/common';

import { FileController } from './fileManagement.controller';
import { ManagerModule } from 'libs/manager';
import { AuthModule } from '@app/modules/auth/auth.module';

@Module({
  imports: [ManagerModule, AuthModule],
  controllers: [FileController],
})
export class FileModule {}
