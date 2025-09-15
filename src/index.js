// index.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // This line is correct
import webhookRouter from './features/webhooks/webhook.router.js';
import { getPrismaClient } from './config/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON requests, essential for handling webhooks and API calls
app.use(express.json());

// --- CORS CONFIGURATION ---
// IMPORTANT: For production, specify your frontend's exact domain for security.
// Your frontend is deployed at 'https://samyuktha-final-submission.onrender.com'
// Using a variable is a best practice.
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://samyuktha-final-submission.onrender.com';

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
// All your API routes are already well-structured. I will combine them here.

// 1. Fetch Key Metrics (Total Customers, Orders, Revenue)
app.get('/api/stats', async (req, res) => {
    const prisma = getPrismaClient();
    const { shop } = req.query;
    if (!shop) return res.status(400).json({ error: "Shop domain is required" });

    try {
        const totalCustomers = await prisma.customer.count({ where: { store: { shopifyShopDomain: shop } } });
        const totalOrders = await prisma.order.count({ where: { store: { shopifyShopDomain: shop } } });
        const revenueAggregation = await prisma.order.aggregate({
            where: { store: { shopifyShopDomain: shop } },
            _sum: { totalPrice: true },
        });
        const totalRevenue = revenueAggregation._sum.totalPrice || 0;
        res.json({ totalCustomers, totalOrders, totalRevenue: totalRevenue.toString() });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// 2. Fetch Orders by Date Range
app.get('/api/orders-by-date', async (req, res) => {
    const prisma = getPrismaClient();
    const { shop, startDate, endDate } = req.query;
    if (!shop || !startDate || !endDate) {
        return res.status(400).json({ error: "Shop, startDate, and endDate are required" });
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                store: { shopifyShopDomain: shop },
                processedAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                }
            },
            orderBy: { processedAt: 'desc' },
            include: { customer: { select: { firstName: true, lastName: true } } }
        });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders by date:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// 3. Fetch Top 5 Customers by Spend
// NOTE: I'm keeping your original '/api/top-customers' route
// and not adding the new '/api/insights/top-customers' one to avoid redundancy.
// Your current code is good and functional.
app.get('/api/top-customers', async (req, res) => {
    const prisma = getPrismaClient();
    const { shop } = req.query;
    if (!shop) return res.status(400).json({ error: "Shop domain is required" });

    try {
        const customerSpending = await prisma.order.groupBy({
            by: ['customerId'],
            where: { store: { shopifyShopDomain: shop } },
            _sum: { totalPrice: true },
            orderBy: { _sum: { totalPrice: 'desc' } },
            take: 5,
        });

        const customerIds = customerSpending.map(c => c.customerId);
        const customers = await prisma.customer.findMany({
            where: { id: { in: customerIds } },
            select: { id: true, firstName: true, lastName: true, email: true }
        });

        const topCustomers = customerSpending.map(spend => {
            const customerInfo = customers.find(c => c.id === spend.customerId);
            return {
                ...customerInfo,
                totalSpent: spend._sum.totalPrice
            }
        });
        res.json(topCustomers);
    } catch (error) {
        console.error("Error fetching top customers:", error);
        res.status(500).json({ error: "Failed to fetch top customers" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});