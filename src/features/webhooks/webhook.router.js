import express from 'express';
import crypto from 'crypto';
import { ingestionQueue } from './webhook.queue.js';

const router = express.Router();

// Security: Middleware to validate that the request is genuinely from Shopify.
const validateShopifyRequest = (req, res, buf) => {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const hash = crypto
        .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
        .update(buf)
        .digest('base64');

    if (hmac !== hash) {
        throw new Error('Webhook HMAC validation failed.');
    }
};

router.use(express.json({ verify: validateShopifyRequest }));

// This single endpoint handles all incoming webhooks.
router.post('/ingest', async (req, res) => {
    try {
        const topic = req.get('X-Shopify-Topic');
        const shopDomain = req.get('X-Shopify-Shop-Domain');
        const jobPayload = {
            topic,
            shopDomain,
            data: req.body,
        };

        // Enqueue the job for asynchronous background processing.
        // This ensures a fast response to Shopify, which is critical.
        await ingestionQueue.add(topic, jobPayload, {
            attempts: 3, // Retry job up to 3 times if it fails
            backoff: { type: 'exponential', delay: 1000 }
        });
        
        res.status(202).send('Accepted'); // Use 202 Accepted for async processing

    } catch (error) {
        console.error("Webhook ingestion error:", error.message);
        res.status(400).send('Webhook validation failed.');
    }
});

export default router;