// src/components/TrendChartWidget.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart, as the backend doesn't have a trend API yet
const revenueTrendData = [
  { name: 'Aug 16', revenue: 2400 }, { name: 'Aug 23', revenue: 1398 },
  { name: 'Aug 30', revenue: 4800 }, { name: 'Sep 06', revenue: 3908 },
  { name: 'Sep 13', revenue: 7800 },
];

const TrendChartWidget = () => (
  <div className="bento-box widget-chart">
    <h3>Revenue Trend (Last 30 Days)</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={revenueTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--bento-border)" />
        <XAxis dataKey="name" stroke="var(--text-secondary)" />
        <YAxis stroke="var(--text-secondary)" />
        <Tooltip contentStyle={{ backgroundColor: 'var(--bento-bg)', border: '1px solid var(--bento-border)' }} />
        <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TrendChartWidget;