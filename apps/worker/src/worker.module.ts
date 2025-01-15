import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ManagerModule } from 'libs/manager';

import { USER_GROUP_ASSIGN } from 'libs/building-block/constants';

import { UserGroupAssignConsumer } from './consumer/userGroupAssign.consumer';
import { DatabaseModule } from '@app/modules/db/database.module';

const DEFAULTJOBOPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 100000,
  },
};

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ envFilePath: 'apps/worker/.env' }),
    ScheduleModule.forRoot(),
    ManagerModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
        // Limit queue to max 1.000 jobs per 5 seconds.

        limiter: {
          max: 20, // Max number of jobs processed
          duration: 5000, // per duration in milliseconds
          bounceBack: false, // When jobs get rate limited, they stay in the waiting queue and are not moved to the delayed queue
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: USER_GROUP_ASSIGN,
      defaultJobOptions: DEFAULTJOBOPTIONS,
    }),
  ],
  controllers: [],
  providers: [ManagerModule, UserGroupAssignConsumer],
})
export class WorkerModule {}
