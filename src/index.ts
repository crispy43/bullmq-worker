import 'dotenv/config';

import { Queue, Worker } from 'bullmq';

import { Module } from './common/abstract';
import { MODULES, WORK_FLAG } from './config';
import { Logger } from './lib/logger';
import { gracefulShutdown } from './lib/process';
import { Redis, RedisDB } from './lib/redis';
import { getEnv } from './lib/utils';

const queueName = getEnv('QUEUE_NAME', 'work');
const redis = Redis(RedisDB.BULL);

class App {
  logger: Logger = new Logger();
  queue: Queue = new Queue(queueName, { connection: redis });
  workers: Worker[] = [];
  modules: Module[] = MODULES.map((M) => new M(this.queue));

  start = async () => {
    await this.queue.obliterate({ force: true });

    for (const module of this.modules) {
      for (const work of Object.values(module.works)) {
        if (WORK_FLAG[work.name]) await module.addQueue(work);
        work.immediately = false;
      }
    }

    this.workers = Array.from(
      { length: parseInt(getEnv('WORKER_COUNT', '3')) },
      () =>
        new Worker(
          queueName,
          async (job) => {
            for (const module of this.modules) {
              const logger = new Logger(job.name);
              await module.work(job, logger);
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
        const logger = this.logger.job(job.name);
        logger.info('✔️');
        for (const module of this.modules) {
          await module.onComplete(job, logger);
          if (module.works[job.name] && module.works[job.name].autoLoop !== false) {
            module.addQueue(module.works[job.name]);
          }
        }
      });
      worker.on('failed', async (job, error) => {
        const logger = this.logger.job(job.name);
        logger.error(error.message);
        for (const module of this.modules) {
          await module.onFailed(job, error, logger);
          if (
            module.works[job.name] &&
            module.works[job.name].autoLoop !== false &&
            module.works[job.name].stopOnFailed !== false
          ) {
            module.addQueue(module.works[job.name]);
          }
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
  app.logger.info(`\x1b[32mLet's work!\x1b[0m`);

  gracefulShutdown(async () => {
    await app.close();
    redis.disconnect();
    app.logger.info('Process exit');
    process.exit(0);
  });
};

bootstrap();
