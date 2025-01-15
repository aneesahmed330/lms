import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RefreshTokenIdsStorageService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: 6379,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onApplicationShutdown(_signal?: string) {
    return this.redisClient.quit();
  }

  async insert(userId: string, tokenId: string) {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }
  async validate(userId: string, tokenId: string) {
    const storeId = await this.redisClient.get(this.getKey(userId));
    return storeId === tokenId;
  }
  async invalidate(userId: string) {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: string) {
    return `user-${userId}`;
  }
}
