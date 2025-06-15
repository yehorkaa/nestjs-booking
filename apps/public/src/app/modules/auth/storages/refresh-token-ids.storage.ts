import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

export class InvalidRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async insert(userId: string, tokenId: string) {
    await this.cacheManager.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string) {
    const token = await this.cacheManager.get(this.getKey(userId));
    if (!token) {
      throw new InvalidRefreshTokenError();
    }
    return token === tokenId;
  }

  async invalidate(userId: string) {
    await this.cacheManager.del(this.getKey(userId));
  }

  private getKey(userId: string) {
    return `user-${userId}`;
  }
}
