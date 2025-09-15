// index.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // <-- ADD THIS LINE
import webhookRouter from './features/webhooks/webhook.router.js';
import { getPrismaClient } from './config/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ADD THIS BLOCK OF CODE
// Use the cors middleware to allow requests from your frontend.
// The default configuration allows all origins, which is fine for development.
app.use(cors());

app.get('/', (req, res) => {
    res.send('Xeno FDE Ingestion Service is running! 🚀');
});

app.use('/webhooks', webhookRouter);


// --- DASHBOARD API ROUTES ---

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

// ADD THIS ENTIRE BLOCK OF CODE TO src/index.js

// This function gets the top 5 customers using Prisma
async function getTopSpendingCustomers() {
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

  // This part fetches the customer names to make the list readable
  const customerDetails = await prisma.customer.findMany({
    where: {
      id: {
        in: topCustomers.map(c => c.customerId),
      },
    },
  });

  // This part combines the data
  const results = topCustomers.map(customerSpend => {
    const details = customerDetails.find(d => d.id === customerSpend.customerId);
    // IMPORTANT: Check that 'firstName' and 'lastName' match your model
    return {
      first_name: details ? details.firstName : 'Unknown',
      last_name: details ? details.lastName : 'Customer',
      total_spend: customerSpend._sum.totalPrice,
    };
  });

  return results;
}

// This is the new API route the frontend will call
app.get('/api/insights/top-customers', async (req, res) => {
  try {
    const customers = await getTopSpendingCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});