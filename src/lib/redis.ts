import * as IoRedis from 'ioredis';

import type { ToJson } from '~/common/types';

import { env } from './utils';

const REDIS_URI = env('REDIS_URI');

// * Redis Database
// TODO: 사용하는 Redis DB 인덱스에 따라 RedisDB enum을 추가
export enum RedisDB {
  BULL = parseInt(env('REDIS_BULL_DB', '0')),
}

// TODO: 기본 Redis DB 설정
const DEFAULT_REDIS_DB = RedisDB.BULL;

const redisDbs = Object.fromEntries(
  Object.values(RedisDB)
    .filter((db) => typeof db === 'number')
    .map((value) => [
      value,
      new IoRedis.Redis(`${REDIS_URI}/${value}`, {
        maxRetriesPerRequest: null,
      }),
    ]),
);

export const Redis = (db?: RedisDB | number) =>
  typeof db !== 'undefined' ? redisDbs[db] : redisDbs[DEFAULT_REDIS_DB];

export const getRedisJson = async <T = any>(key: string, db?: RedisDB | number) => {
  const data = await Redis(db).get(key);
  return data ? (JSON.parse(data) as ToJson<T>) : null;
};

export const setRedisJson = async (
  key: string,
  value: any,
  { db, expireTime }: { db?: RedisDB | number; expireTime?: number } = {
    db: DEFAULT_REDIS_DB,
  },
) => {
  return expireTime
    ? await Redis(db).set(key, JSON.stringify(value), 'EX', expireTime)
    : await Redis(db).set(key, JSON.stringify(value));
};

export const delRedis = async (key: string, db?: RedisDB | number) => {
  return await Redis(db).del(key);
};
