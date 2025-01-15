import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';

import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);

  // еnabling comprеssion, you can significantly rеducе the sizе of thе data sent to thе cliеnt
  app.use(compression());

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  // const userImportQueue = new Queue(IMPORT_USER_QUEUE, {
  //   connection: {
  //     host: process.env.REDIS_HOST,
  //     port: process.env.REDIS_PORT as unknown as number,
  //   },
  // });

  // adapter

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/api/v1/core/queues');
  const option = { uiConfig: { boardTitle: 'V2 Redis' } };

  createBullBoard({
    queues: [
      // new BullMQAdapter(userImportQueue),
    ],
    serverAdapter,
    options: option,
  });
  app.use('/api/v1/core/queues', serverAdapter.getRouter());

  await app.listen(process.env.PORT || 3004, () => {
    Logger.log('For the UI, open http://localhost:3004/api/v1/core/queues');
  });
}

bootstrap();
