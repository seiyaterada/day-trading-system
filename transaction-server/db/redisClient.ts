// redisClient.ts
import * as redis from 'redis';

const redisClient = redis.createClient({
  socket: {
    host: 'redis',
    port: 6379
  }
}
);

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error(`Redis error: ${err}`);
});

export default redisClient;