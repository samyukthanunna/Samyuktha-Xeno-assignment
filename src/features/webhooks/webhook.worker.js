import 'dotenv/config'; // Make sure environment variables are loaded
import { Worker } from 'bullmq';
import { redisConnection } from '../../config/redis.js';
import { handleNewOrder, handleNewProduct } from './webhook.handlers.js';

// The handler map provides a clean, scalable way to route topics to the correct logic.
const topicHandlers = {
    'orders/create': handleNewOrder,
    'products/create': handleNewProduct,
    // 'customers/create': handleNewCustomer, // TODO: Add this once you create the handler
};

console.log('🚀 Worker process started. Listening for ingestion jobs...');

const worker = new Worker('ingestion-queue', async (job) => {
    const { topic, shopDomain, data } = job.data;
    
    const handler = topicHandlers[topic];

    if (handler) {
        // Job processing wrapped in a try-catch block for robust error handling
        try {
            await handler(shopDomain, data);
        } catch (error) {
            console.error(`Error processing job ${job.id} for topic ${topic}:`, error.message);
            throw error; // Re-throw error to let BullMQ handle the job failure (and retry)
        }
    } else {
        console.warn(`[${shopDomain}] No handler registered for topic: ${topic}`);
    }
}, { connection: redisConnection });


worker.on('completed', (job) => {
    console.info(`✅ Completed job ${job.id} for topic: ${job.name}`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job.id} failed for topic ${job.name} with error: ${err.message}`);
});