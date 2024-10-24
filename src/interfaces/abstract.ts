import { Job, JobsOptions, Queue } from 'bullmq';

import { WORK_DELAY, WorkName } from '~/config';
import { SEC } from '~/constants/common';
import { Logger } from '~/lib/logger';
import { getEnv } from '~/lib/utils';

interface WorkConfig {
  name: string;
  data?: any;
  options?: JobsOptions;
  immediately?: boolean;
  autoLoop?: boolean;
}

// * Module 클래스
export abstract class Module {
  logger: Logger;
  queue: Queue;
  works: { [key in WorkName]?: WorkConfig } = {};

  constructor(logger: Logger, queue: Queue, works: WorkConfig[] = []) {
    this.logger = logger;
    this.queue = queue;
    works.forEach((work) => {
      this.works[work.name] = work;
    });
  }

  addQueue = async (config: WorkConfig) => {
    await this.queue.add(config.name, config.data ?? {}, {
      delay: config.immediately ? 0 : (WORK_DELAY[config.name] ?? 1 * SEC),
      removeOnComplete: parseInt(getEnv('QUEUE_LIMIT', '100')),
      ...config.options,
    });
  };

  abstract work: (job: Job) => Promise<void>;
  onComplete: (job: Job) => Promise<void> = async () => {};
  onFailed: (job: Job, error: Error) => Promise<void> = async () => {};
}
