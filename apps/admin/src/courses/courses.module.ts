import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { ManagerModule } from 'libs/manager';

@Module({
  imports: [ManagerModule],
  controllers: [CoursesController],
})
export class CoursesModule {}
