// features/webhooks/webhook.handlers.js
import crypto from 'crypto';
import { getPrismaClient } from '../../config/prisma.js';

// This function verifies the webhook signature
const verifyWebhook = (req) => {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const body = req.body;
  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(body, 'utf8')
    .digest('base64');
  return hmac === hash;
};

// Main handler function
export const handleShopifyWebhook = async (req, res) => {
  // 1. Verify the webhook is from Shopify
  //if (!verifyWebhook(req)) {
  //  return res.status(401).send('Webhook verification failed.');
  //}

  // 2. Get the event topic and shop domain from headers
  const topic = req.get('X-Shopify-Topic');
  const shop = req.get('X-Shopify-Shop-Domain');
  const data = JSON.parse(req.body.toString());
  const prisma = getPrismaClient();

  console.log(`Received webhook for topic: ${topic} from shop: ${shop}`);

  try {
    // 3. Find the store in your database
    const store = await prisma.store.findUnique({
      where: { shopifyShopDomain: shop },
    });

    if (!store) {
      throw new Error(`Store not found for domain: ${shop}`);
    }

    // 4. Use a switch statement to handle different topics
    switch (topic) {
      case 'customers/create':
      case 'customers/update':
        await prisma.customer.upsert({
          where: { shopifyCustomerId: data.id },
          update: {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
          },
          create: {
            shopifyCustomerId: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            storeId: store.id,
          },
        });
        break;

      case 'orders/create':
        // Ensure the customer exists before creating the order
        const customer = await prisma.customer.findUnique({
          where: { shopifyCustomerId: data.customer.id },
        });

        if (customer) {
          await prisma.order.create({
            data: {
              shopifyOrderId: data.id,
              totalPrice: parseFloat(data.total_price),
              processedAt: new Date(data.processed_at),
              storeId: store.id,
              customerId: customer.id,
            },
          });
        }
        break;
      
      // You can add more cases here for products, etc.
      // case 'products/create':
      // case 'products/update':
      //   ...
      //   break;
    }

    // 5. Send a 200 OK response to Shopify to acknowledge receipt
    res.status(200).send('Webhook received.');
  } catch (error) {
    console.error(`Error processing webhook for topic ${topic}:`, error);
    res.status(500).send('Error processing webhook.');
  }
};

// file: features/webhooks/webhook.handlers.js
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;

const handleShopifyWebhook = async (req, res) => {
  // Always verify the webhook for security
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const body = req.rawBody; // Make sure express.raw() middleware is used for this

  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(body, 'utf8', 'hex')
    .digest('base64');

  if (generatedHash !== hmac) {
    return res.status(401).send('Webhook verification failed.');
  }

  // Determine the type of webhook event
  const topic = req.get('X-Shopify-Topic');
  const storeDomain = req.get('X-Shopify-Shop-Domain');

  // --- Start: Your Data Ingestion Logic ---
  const data = JSON.parse(body);

  try {
    // Look up the store in your database
    const store = await prisma.store.findUnique({
      where: { shopifyStoreId: storeDomain },
    });

    if (!store) {
      console.error('Store not found for domain:', storeDomain);
      return res.status(404).send('Store not found.');
    }

    if (topic === 'customers/create' || topic === 'customers/update') {
      await prisma.customer.upsert({
        where: { id: data.id },
        update: {
          // Map updated customer data
          name: data.first_name + ' ' + data.last_name,
          email: data.email,
          // ... add other fields from Shopify
          storeId: store.id
        },
        create: {
          id: data.id,
          name: data.first_name + ' ' + data.last_name,
          email: data.email,
          // ...
          storeId: store.id
        },
      });
      console.log('Customer webhook processed.');
    } else if (topic === 'orders/create' || topic === 'orders/updated') {
      await prisma.order.upsert({
        where: { id: data.id },
        update: {
          totalPrice: data.total_price,
          // ... add other order fields
          storeId: store.id
        },
        create: {
          id: data.id,
          totalPrice: data.total_price,
          // ...
          storeId: store.id
        },
      });
      console.log('Order webhook processed.');
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).send('Internal Server Error.');
  }

  // --- End: Your Data Ingestion Logic ---
  res.status(200).send('Webhook processed successfully.');
};

module.exports = { handleShopifyWebhook };