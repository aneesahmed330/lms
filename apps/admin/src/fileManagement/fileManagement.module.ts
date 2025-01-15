import { Module } from '@nestjs/common';

import { ManagerModule } from '@app/manager';
import { BullMQModule } from '@app/manager/bullmq.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { FileManagementController } from './fileManagement.controller';

@Module({
  imports: [ManagerModule, AuthModule, BullMQModule],
  controllers: [FileManagementController],
})
export class FileManagementModule {}
