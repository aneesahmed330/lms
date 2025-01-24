import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { ManagerModule } from 'libs/manager';

@Module({
  imports: [ManagerModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
