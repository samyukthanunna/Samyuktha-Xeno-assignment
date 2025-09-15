import { Queue } from 'bullmq';
import { redisConnection } from '../../config/redis.js';

// The queue is named 'ingestion-queue' to be more descriptive of its purpose.
export const ingestionQueue = new Queue('ingestion-queue', {
    connection: redisConnection,
});