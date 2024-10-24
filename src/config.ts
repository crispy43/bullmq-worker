// TODO: 모듈 및 Work 추가시 각 설정에 추가
import { SEC } from './constants/common';
import { getEnv } from './lib/utils';
import AlphaModule from './modules/alpha/module';

// * Modules
export const MODULES = [AlphaModule] as const;

// * Work Name
export enum WorkName {
  DO_SOMETHING = 'doSomething',
  DO_SOMETHING_ELSE = 'doSomethingElse',
}

// * On/Off
export const WORK_FLAG: { [key in WorkName]: boolean } = {
  [WorkName.DO_SOMETHING]: getEnv('WORK_DO_SOMETHING') === 'true',
  [WorkName.DO_SOMETHING_ELSE]: getEnv('WORK_DO_SOMETHING_ELSE') === 'true',
} as const;

// * Delay
export const WORK_DELAY: { [key in WorkName]: number } = {
  [WorkName.DO_SOMETHING]: 1 * SEC,
  [WorkName.DO_SOMETHING_ELSE]: 5 * SEC,
} as const;
