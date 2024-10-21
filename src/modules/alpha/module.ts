import { Job, Queue } from 'bullmq';

import { WorkName } from '~/config';
import { Module } from '~/interfaces/abstract';
import { Logger } from '~/lib/logger';

export default class AlphaModule extends Module {
  constructor(logger: Logger, queue: Queue) {
    super(logger, queue, [{ name: WorkName.DO_SOMETHING, immediately: true }]);
  }

  work = async (job: Job) => {
    switch (job.name) {
      case WorkName.DO_SOMETHING:
        console.log('DO_SOMETHING');
        break;
      default:
        break;
    }
  };

  onComplete = async (job: Job) => {
    switch (job.name) {
      case WorkName.DO_SOMETHING:
        await this.addQueue({ name: job.name });
        break;
      default:
        break;
    }
  };

  onFailed = async (job: Job) => {
    switch (job.name) {
      case WorkName.DO_SOMETHING:
        await this.addQueue({ name: job.name });
        break;
      default:
        break;
    }
  };
}
