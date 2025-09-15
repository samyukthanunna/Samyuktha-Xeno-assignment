// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './index.css';

// Import the new components from their separate files
import KeyMetricsWidget from './components/KeyMetricsWidget';
import TrendChartWidget from './components/TrendChartWidget';
import TopCustomersWidget from './components/TopCustomersWidget';
import OrdersByDateWidget from './components/OrdersByDateWidget';

// --- CONFIGURATION ---
const BACKEND_URL = 'https://samyuktha-xeno-assignment.onrender.com'; // ⚠️ REMEMBER TO PASTE YOUR RENDER URL HERE
const SHOP_DOMAIN = 'samyuktha-xeno-assignment.myshopify.com';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [startDate, setStartDate] = useState('2025-09-01');
  const [endDate, setEndDate] = useState('2025-09-15');

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/stats?shop=${SHOP_DOMAIN}`)
      .then(response => setMetrics(response.data))
      .catch(err => console.error("Error fetching stats:", err));

    axios.get(`${BACKEND_URL}/api/top-customers?shop=${SHOP_DOMAIN}`)
      .then(response => setTopCustomers(response.data))
      .catch(err => console.error("Error fetching top customers:", err));
  }, []);

  const fetchOrders = useCallback(() => {
    axios.get(`${BACKEND_URL}/api/orders-by-date?shop=${SHOP_DOMAIN}&startDate=${startDate}&endDate=${endDate}`)
      .then(response => setOrders(response.data))
      .catch(err => console.error("Error fetching orders:", err));
  }, [startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Shopify Insights Dashboard</h1>
        <p>Tenant: {SHOP_DOMAIN}</p>
      </header>
      
      {/* This is now much cleaner! We are just arranging the components
        and passing the live data down to them as props.
      */}
      <main className="bento-grid">
        <KeyMetricsWidget metrics={metrics} />
        <TrendChartWidget />
        <TopCustomersWidget customers={topCustomers} />
        <OrdersByDateWidget 
          orders={orders}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onFilter={fetchOrders}
        />
      </main>
    </div>
  );
}

export default App;