import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import webhookRouter from './features/webhooks/webhook.router.js';
import { getPrismaClient } from './config/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE & CORS CONFIGURATION ---
app.use(express.json());

// Allow all origins for the assignment submission
app.use(cors());


// --- ROUTES ---
app.get('/', (req, res) => {
  res.send('Xeno FDE Ingestion Service is running! 🚀');
});

app.use('/webhooks', webhookRouter);


// --- DASHBOARD API ROUTES ---
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

app.get('/api/insights/top-customers', async (req, res) => {
    const prisma = getPrismaClient();
    try {
        const topCustomersBySpend = await prisma.order.groupBy({
            by: ['customerId'],
            _sum: {
                totalPrice: true,
            },
            orderBy: {
                _sum: {
                    totalPrice: 'desc',
                },
            },
            take: 5,
        });
        
        if (topCustomersBySpend.length === 0) {
            return res.json([]);
        }

        const customerDetails = await prisma.customer.findMany({
            where: {
                id: {
                    in: topCustomersBySpend.map(c => c.customerId),
                },
            },
        });

        const results = topCustomersBySpend.map(spendData => {
            const details = customerDetails.find(d => d.id === spendData.customerId);
            return {
                id: details ? details.id : 'unknown',
                first_name: details ? details.firstName : 'Unknown',
                last_name: details ? details.lastName : 'Customer',
                total_spend: spendData._sum.totalPrice,
            };
        });
        res.json(results);
    } catch (error) {
        console.error('Error fetching top customers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
