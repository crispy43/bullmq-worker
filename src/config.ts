import { SEC } from './constants/common';
import { getEnv } from './lib/utils';

// * Work Name
export enum WorkName {
  DO_SOMETHING = 'doSomething',
}

// * On/Off
export const WORK_FLAG: { [key in WorkName]: boolean } = {
  [WorkName.DO_SOMETHING]: getEnv('WORK_DO_SOMETHING') === 'true',
} as const;

// * Delay
export const WORK_DELAY: { [key in WorkName]: number } = {
  [WorkName.DO_SOMETHING]: 1 * SEC,
} as const;
