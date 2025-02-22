import { Job, Queue } from 'bullmq';

import { Module } from '~/common/abstract';
import { WorkName } from '~/config';
import { Logger } from '~/lib/logger';

export default class AlphaModule extends Module {
  constructor(queue: Queue) {
    super(queue, [
      { name: WorkName.DO_SOMETHING, immediately: true },
      { name: WorkName.DO_SOMETHING_ELSE, immediately: false },
    ]);
  }

  work = async (job: Job, logger: Logger) => {
    switch (job.name) {
      case WorkName.DO_SOMETHING: {
        logger.info('🔨 Do something');
        break;
      }
      case WorkName.DO_SOMETHING_ELSE: {
        logger.info('🔧 Do something else');
        break;
      }
      default:
        break;
    }
  };
}
