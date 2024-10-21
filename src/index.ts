import 'dotenv/config';

import { Queue, Worker } from 'bullmq';

import { Module } from './interfaces/abstract';
import { Logger } from './lib/logger';
import { gracefulShutdown } from './lib/process';
import redis, { pub, sub } from './lib/redis';
import AlphaModule from './modules/alpha/module';
import { getEnv } from './lib/utils';
import { WORK_FLAG } from './config';

const queueName = getEnv('QUEUE_NAME', 'work');
const workerCount = getEnv('WORKER_COUNT', '3');

class App {
  logger: Logger = new Logger();
  queue: Queue = new Queue(queueName, { connection: redis });
  workers: Worker[] = [];
  // TODO: 모듈 추가시 배열에 추가
  modules: Module[] = [new AlphaModule(this.logger, this.queue)];

  start = async () => {
    await this.queue.obliterate({ force: true });

    for (const module of this.modules) {
      for (const args of module.initialQueues) {
        if (WORK_FLAG[args.name]) await module.addQueue(args);
      }
    }

    this.workers = Array.from(
      { length: parseInt(workerCount) },
      () =>
        new Worker(
          queueName,
          async (job) => {
            for (const module of this.modules) {
              await module.work(job);
            }
          },
          {
            connection: redis,
            concurrency: parseInt(getEnv('WORKER_CONCURRENCY', '100')),
          },
        ),
    );

    this.workers.forEach((worker) => {
      worker.on('completed', async (job) => {
        this.logger.info('completed', job.name);
        for (const module of this.modules) {
          await module.onComplete(job);
        }
      });
      worker.on('failed', async (job, error) => {
        this.logger.error(error.message, job.name);
        for (const module of this.modules) {
          await module.onFailed(job, error);
        }
      });
    });
  };

  close = async () => {
    await this.queue.close();
    for (const worker of this.workers) {
      await worker.close(true);
    }
  };
}

const bootstrap = async () => {
  const app = new App();
  await app.start();
  app.logger.info('\x1b[32mScanner started!\x1b[0m');

  gracefulShutdown(async () => {
    await app.close();
    redis.disconnect();
    pub.disconnect();
    sub.disconnect();
    app.logger.info('Process exit');
    process.exit(0);
  });
};

bootstrap();
