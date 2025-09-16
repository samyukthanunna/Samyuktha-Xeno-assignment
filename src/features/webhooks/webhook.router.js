// file: features/webhooks/webhook.router.js
const express = require('express');
const { handleShopifyWebhook } = require('./webhook.handlers');

const router = express.Router();

// A single route to handle all incoming Shopify webhooks
// which is needed for HMAC signature verification.
router.post('/shopify/customers', handleShopifyWebhook);
router.post('/shopify/orders', handleShopifyWebhook);
router.post('/shopify/products', handleShopifyWebhook);
router.post('/shopify/checkouts', handleShopifyWebhook);
router.post('/shopify/carts', handleShopifyWebhook);

module.exports = router;