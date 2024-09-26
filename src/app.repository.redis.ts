import { AppRepository } from './app.repository';
import { Observable, from, mergeMap } from 'rxjs';
import { createClient, RedisClientType } from 'redis';

export class AppRepositoryRedis implements AppRepository {
  private readonly redisClient: RedisClientType;

  constructor() {
    const host = process.env.REDIS_HOST || 'redis';
    const port = +process.env.REDIS_PORT || 6379;
    this.redisClient = createClient({
      url: `redis://${host}:${port}`,
    });
    from(this.redisClient.connect()).subscribe({ error: console.error });

    this.redisClient.on('error', err => console.error(`Redis error: ${err}`));
    this.redisClient.on('reconnecting', () => console.info('Redis reconnecting, attempt'));
    this.redisClient.on('connect', () => console.info('Redis connected'));
    this.redisClient.on('ready', () => console.info('Redis ready'));
    this.redisClient.on('end', () => console.info('Redis connection closed'));
  }

  get(hash: string): Observable<string> {
    return from(this.redisClient.get(hash));
  }

  put(hash: string, url: string): Observable<string> {
    return from(this.redisClient.set(hash, url)).pipe(mergeMap(() => from(this.redisClient.get(hash))));
  }
}
