// file: backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const insightsRouter = require('./routes/insights');
const webhookRouter = require('./routes/webhooks');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors()); // Allows your frontend to make requests
app.use(bodyParser.json());

// Main API Routes for the Dashboard
app.use('/api/insights', insightsRouter);

// Shopify Webhook Routes
app.use('/api/webhooks', webhookRouter);

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Xeno Ingestion Service is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
