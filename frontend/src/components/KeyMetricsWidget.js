import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KeyMetricsWidget.css'; 

const KeyMetricsWidget = () => {
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('https://samyuktha-xeno-assignment-ozpvf47mr-sams-projects-8338b950.vercel.app'); 
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <h3>Total Revenue</h3>
        <p className="kpi-value">${metrics.totalRevenue.toFixed(2)}</p>
      </div>
      <div className="kpi-card">
        <h3>Total Orders</h3>
        <p className="kpi-value">{metrics.totalOrders}</p>
      </div>
      <div className="kpi-card">
        <h3>Total Customers</h3>
        <p className="kpi-value">{metrics.totalCustomers}</p>
      </div>
    </div>
  );
};

export default KeyMetricsWidget;