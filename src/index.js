// src/index.js - CORRECTED VERSION

import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // FIX 1: Removed duplicate import
import webhookRouter from './features/webhooks/webhook.router.js';
import { getPrismaClient } from './config/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE & CORS CONFIGURATION ---

// Middleware for parsing JSON requests
app.use(express.json());

// For production, specify your frontend's exact domain for security.
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://samyuktha-final-submission.onrender.com';

// FIX 2: Using only ONE cors configuration. This is the correct way.
app.use(cors({
  origin: FRONTEND_URL
}));


// --- ROUTES ---

// A simple health check route
app.get('/', (req, res) => {
  res.send('Xeno FDE Ingestion Service is running! 🚀');
});

// Webhook router for receiving data from Shopify
app.use('/webhooks', webhookRouter);


// --- DASHBOARD API ROUTES ---

// 1. Fetch Key Metrics (Total Customers, Orders, Revenue)
app.get('/api/stats', async (req, res) => {
  const prisma = getPrismaClient();
  const { shop } = req.query;

  try {
    const totalCustomers = await prisma.customer.count({ where: { shop } });
    const totalOrders = await prisma.order.count({ where: { shop } });
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: { shop },
    });
    res.json({
      totalCustomers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 2. Fetch Orders by Date Range
app.get('/api/orders-by-date', async (req, res) => {
  const prisma = getPrismaClient();
  const { shop, startDate, endDate } = req.query;

  try {
    const orders = await prisma.order.findMany({
      where: {
        shop,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 3. Fetch Top 5 Customers by Spend (Original Route)
app.get('/api/top-customers', async (req, res) => {
  const prisma = getPrismaClient();
  const { shop } = req.query;

  try {
    const topCustomers = await prisma.customer.findMany({
      where: { shop },
      orderBy: { totalSpent: 'desc' },
      take: 5,
    });
    res.json(topCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top customers' });
  }
});

// FIX 3: MOVED THIS ENTIRE BLOCK TO BE *BEFORE* app.listen
// This is the new API route the frontend will call
app.get('/api/insights/top-customers', async (req, res) => {
    const prisma = getPrismaClient(); // FIX 4: Added prisma client instance
    try {
        // IMPORTANT: Check that 'order' and 'customer' match your model names in schema.prisma
        const topCustomers = await prisma.order.groupBy({
            by: ['customerId'], // Check this field name in your Order model
            _sum: {
                totalPrice: true, // Check this field name in your Order model
            },
            orderBy: {
                _sum: {
                    totalPrice: 'desc',
                },
            },
            take: 5,
        });

        const customerDetails = await prisma.customer.findMany({
            where: {
                id: {
                    in: topCustomers.map(c => c.customerId),
                },
            },
        });

        const results = topCustomers.map(customerSpend => {
            const details = customerDetails.find(d => d.id === customerSpend.customerId);
            return {
                id: details ? details.id : 'unknown', // Pass ID for React key
                first_name: details ? details.firstName : 'Unknown',
                last_name: details ? details.lastName : 'Customer',
                total_spend: customerSpend._sum.totalPrice,
            };
        });
        res.json(results);
    } catch (error) {
        console.error('Error fetching top customers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// --- START SERVER ---
// This MUST be the last part of the file
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});