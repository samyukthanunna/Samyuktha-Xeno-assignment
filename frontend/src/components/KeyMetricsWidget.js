// src/components/KeyMetricsWidget.js
import React from 'react';

const KeyMetricsWidget = ({ metrics }) => (
  <div className="bento-box widget-kpi">
    <div className="kpi-item">
      <h4>Total Revenue</h4>
      <p>${metrics ? parseFloat(metrics.totalRevenue).toFixed(2) : '...'}</p>
    </div>
    <div className="kpi-item">
      <h4>Total Orders</h4>
      <p>{metrics ? metrics.totalOrders : '...'}</p>
    </div>
    <div className="kpi-item">
      <h4>Total Customers</h4>
      <p>{metrics ? metrics.totalCustomers : '...'}</p>
    </div>
  </div>
);

export default KeyMetricsWidget;