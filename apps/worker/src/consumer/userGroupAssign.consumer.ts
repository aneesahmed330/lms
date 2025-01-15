import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { USER_GROUP_ASSIGN } from 'libs/building-block/constants';

@Processor(USER_GROUP_ASSIGN)
export class UserGroupAssignConsumer extends WorkerHost {
  private readonly logger = new Logger(UserGroupAssignConsumer.name);
  constructor() {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    try {
    } catch (e) {
      console.log('🚀 ~ UserGroupAssignConsumer ~ e:', job);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(
    job: Job<{
      groupId: string;
      userId: string;
    }>,
  ) {
    this.logger.log(`Job completed for ${JSON.stringify(job.data)}`);
  }
}
