import { Job, JobsOptions, Queue } from 'bullmq';

import { SEC } from '~/common/constants';
import { WORK_DELAY, WorkName } from '~/config';
import { Logger } from '~/lib/logger';
import { getEnv } from '~/lib/utils';

interface WorkConfig {
  name: string;
  data?: any;
  options?: JobsOptions;
  immediately?: boolean; // 즉시 실행 여부 (기본 false)
  autoLoop?: boolean; // 자동 반복 여부 (기본 true)
  stopOnFailed?: boolean; // 실패시 반복 중지 여부 (기본 false)
}

// * Module 클래스
export abstract class Module {
  queue: Queue;
  works: { [key in WorkName]?: WorkConfig } = {};

  constructor(queue: Queue, works: WorkConfig[] = []) {
    this.queue = queue;
    works.forEach((work) => {
      this.works[work.name] = work;
    });
  }

  addQueue = async (config: WorkConfig) => {
    await this.queue.add(config.name, config.data ?? {}, {
      delay: config.immediately ? 0 : WORK_DELAY[config.name] ?? 1 * SEC,
      removeOnComplete: parseInt(getEnv('QUEUE_LIMIT', '100')),
      ...config.options,
    });
  };

  abstract work: (job: Job, logger: Logger) => Promise<void>;
  onComplete: (job: Job, logger: Logger) => Promise<void> = async () => {};
  onFailed: (job: Job, error: Error, logger: Logger) => Promise<void> = async () => {};
}
