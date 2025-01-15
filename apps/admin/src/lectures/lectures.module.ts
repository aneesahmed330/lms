import { Module } from '@nestjs/common';
import { LecturesController } from './lectures.controller';
import { ManagerModule } from 'libs/manager';

@Module({
  imports: [ManagerModule],
  controllers: [LecturesController],
})
export class LecturesModule {}
