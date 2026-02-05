import Redis, { type Redis as RedisClient } from 'ioredis';

import { env } from '../../lib/utils';

const REDIS_URI = env('REDIS_URI');

// * Redis Database index
export enum RedisDB {
  BULL = 0,
}

const DEFAULT_REDIS_DB = RedisDB.BULL;

// 숫자 DB index 기반으로 클라이언트 캐시
const clients = new Map<number, RedisClient>();

function getClient(db: number = DEFAULT_REDIS_DB): RedisClient {
  const dbIndex = Number(db);
  const existing = clients.get(dbIndex);
  if (existing) return existing;
  const client = new Redis(REDIS_URI, {
    db: dbIndex,
    maxRetriesPerRequest: null, // (BullMQ/BLPOP 등 목적이면 고려)
    // retryStrategy: (times) => Math.min(times * 50, 2000),
    enableOfflineQueue: true,
    lazyConnect: false,
  });
  client.on('error', (err) => {
    console.error(`[redis:${dbIndex}] error`, err);
  });
  client.on('connect', () => console.info(`[redis:${dbIndex}] connect`));
  client.on('ready', () => console.info(`[redis:${dbIndex}] ready`));
  client.on('reconnecting', () => console.info(`[redis:${dbIndex}] reconnecting`));
  clients.set(dbIndex, client);
  return client;
}

export const RedisClientOf = (db?: RedisDB | number) =>
  getClient(typeof db === 'number' ? db : (db ?? DEFAULT_REDIS_DB));

export async function getRedisJson<T = unknown>(
  key: string,
  db?: RedisDB | number,
): Promise<T | null> {
  const raw = await RedisClientOf(db).get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[redis] invalid json for key=${key}`, e);
    return null;
  }
}

export async function setRedisJson(
  key: string,
  value: unknown,
  opts: { db?: RedisDB | number; expireTime?: number } = {},
) {
  const client = RedisClientOf(opts.db);
  const payload = JSON.stringify(value);

  if (opts.expireTime && opts.expireTime > 0) {
    return client.set(key, payload, 'EX', opts.expireTime);
  }
  return client.set(key, payload);
}

export async function delRedis(key: string, db?: RedisDB | number) {
  return RedisClientOf(db).del(key);
}

export async function existsRedis(key: string, db?: RedisDB | number): Promise<boolean> {
  const result = await RedisClientOf(db).exists(key);
  return result === 1;
}

export async function quitAllRedis() {
  await Promise.all(Array.from(clients.values()).map((client) => client.quit()));
}

// 기본 DB export
export default RedisClientOf();
