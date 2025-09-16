const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

// CORRECTED PATH - notice the capital 'R' in webhookRouter.js
const webhookRouter = require('./features/webhooks/webhookRouter.js');
// TEMPORARILY DISABLED - This folder does not exist yet.
// const insightsRouter = require('./features/insights/router.js');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Main API Routes for the Dashboard - TEMPORARILY DISABLED
// app.use('/api/insights', insightsRouter);

// Shopify Webhook Routes
app.use('/api/webhooks', webhookRouter);

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Xeno Ingestion Service is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});