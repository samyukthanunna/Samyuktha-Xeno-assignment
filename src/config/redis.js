// A centralized Redis connection for BullMQ.
// This allows both the web server and the worker to use the same connection settings.
import IORedis from 'ioredis';

export const redisConnection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null // Important for BullMQ reliability
});