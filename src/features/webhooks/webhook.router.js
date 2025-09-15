// features/webhooks/webhook.router.js
import express from 'express';
import { handleShopifyWebhook } from './webhook.handlers.js';

const router = express.Router();

// A single route to handle all incoming Shopify webhooks
// We use express.raw({ type: 'application/json' }) to get the raw request body, 
// which is needed for HMAC signature verification.
router.post('/shopify', express.raw({ type: 'application/json' }), handleShopifyWebhook);

export default router;