import * as IoRedis from 'ioredis';

import { ToJson } from '~/common/types';

import { getEnv } from './utils';

const REDIS_URI = getEnv('REDIS_URI');

// * Redis Database
// TODO: 사용하는 Redis DB 인덱스에 따라 RedisDB enum을 변경
export enum RedisDB {
  BULL = parseInt(getEnv('BULL_REDIS_DB', '0')),
}

export const Redis = (db: RedisDB) =>
  new IoRedis.Redis(`${REDIS_URI}/${db}`, {
    maxRetriesPerRequest: null,
  });

export const getRedisJson = async <T = any>(key: string, db?: RedisDB) => {
  const data = await Redis(db).get(key);
  return data ? (JSON.parse(data) as ToJson<T>) : null;
};

export const setRedisJson = async (
  key: string,
  value: any,
  db?: RedisDB,
  expireTime?: number, // 만료시간 (초)
) => {
  return expireTime
    ? await Redis(db).set(key, JSON.stringify(value), 'EX', expireTime)
    : await Redis(db).set(key, JSON.stringify(value));
};

export const delRedis = async (key: string, db?: RedisDB) => {
  return await Redis(db).del(key);
};
