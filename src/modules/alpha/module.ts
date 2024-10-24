import { Job, Queue } from 'bullmq';

import { WorkName } from '~/config';
import { Module } from '~/interfaces/abstract';
import { Logger } from '~/lib/logger';

export default class AlphaModule extends Module {
  constructor(logger: Logger, queue: Queue) {
    super(logger, queue, [
      { name: WorkName.DO_SOMETHING, immediately: true },
      { name: WorkName.DO_SOMETHING_ELSE, immediately: false },
    ]);
  }

  work = async (job: Job) => {
    switch (job.name) {
      case WorkName.DO_SOMETHING: {
        this.logger.info('🔨 Do something');
        break;
      }
      case WorkName.DO_SOMETHING_ELSE: {
        this.logger.info('🔧 Do something else');
        break;
      }
      default:
        break;
    }
  };
}
