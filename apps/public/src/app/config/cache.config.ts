import { registerAs } from '@nestjs/config';

export default registerAs('redis-cache', () => ({
  ttl: parseInt(process.env.CACHE_TTL ?? '60000', 10), // 60000ms = 1 minute
  redisUrl: process.env.REDIS_URL,
}));