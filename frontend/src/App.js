// frontend/src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './index.css';

// --- CONFIGURATION ---
// Change this line to use the environment variable
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Ensure this is also an environment variable for true multi-tenancy
// For this assignment, keeping it as is should be fine if you're not
// building a multi-tenant auth flow.
const SHOP_DOMAIN = 'samyuktha-xeno-assignment.myshopify.com';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [startDate, setStartDate] = useState('2025-09-01');
  const [endDate, setEndDate] = useState('2025-09-15');

  // ... (The rest of your code remains the same)
  // Your axios calls will now automatically use the new variable:
  // axios.get(`${BACKEND_URL}/api/stats?shop=${SHOP_DOMAIN}`)
  // ...
}

export default App;