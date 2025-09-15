import 'dotenv/config'; // Load environment variables
import express from 'express';
import webhookRouter from './features/webhooks/webhook.router.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Xeno FDE Ingestion Service is running! 🚀');
});

// All webhook traffic is routed through here.
// Shopify will send POST requests to /webhooks/ingest
app.use('/webhooks', webhookRouter);

// TODO: Add routes for authentication and your dashboard APIs here

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});