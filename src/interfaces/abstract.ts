import { Job, JobsOptions, Queue } from 'bullmq';

import { WORK_DELAY } from '~/config';
import { SEC } from '~/constants/common';
import { Logger } from '~/lib/logger';
import { getEnv } from '~/lib/utils';

interface AddQueueArgs {
  name: string;
  data?: any;
  immediately?: boolean;
  autoLoop?: boolean;
  options?: JobsOptions;
}

// * Module 클래스
export abstract class Module {
  logger: Logger;
  queue: Queue;
  initialQueues: AddQueueArgs[];

  constructor(logger: Logger, queue: Queue, initialQueues: AddQueueArgs[] = []) {
    this.logger = logger;
    this.queue = queue;
    this.initialQueues = initialQueues;
  }

  addQueue = async (args: AddQueueArgs) => {
    await this.queue.add(args.name, args.data ?? {}, {
      delay: args.immediately ? 0 : (WORK_DELAY[args.name] ?? 1 * SEC),
      removeOnComplete: parseInt(getEnv('QUEUE_LIMIT', '100')),
      ...args.options,
    });
  };

  abstract work: (job: Job) => Promise<void>;
  onComplete: (job: Job) => Promise<void> = async () => {};
  onFailed: (job: Job, error: Error) => Promise<void> = async () => {};
}
