import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import webhookRouter from './features/webhooks/webhook.router.js';
import { getPrismaClient } from './config/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Allow all origins for the assignment submission
app.use(cors());

// --- ROUTES ---
app.get('/', (req, res) => {
  res.send('Xeno FDE Ingestion Service is running! 🚀');
});

app.use('/webhooks', webhookRouter);

// --- DASHBOARD API ROUTES ---
app.get('/api/insights/top-customers', async (req, res) => {
    const prisma = getPrismaClient();
    try {
        const topCustomersBySpend = await prisma.order.groupBy({
            by: ['customerId'],
            _sum: { totalPrice: true, },
            orderBy: { _sum: { totalPrice: 'desc', }, },
            take: 5,
        });

        const customerDetails = await prisma.customer.findMany({
            where: { id: { in: topCustomersBySpend.map(c => c.customerId), }, },
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
