import React from 'react';
import './App.css'; // Your main CSS for styling the layout
import KeyMetricsWidget from './components/KeyMetricsWidget';
import OrdersByDateWidget from './components/OrdersByDateWidget';
import TopCustomersWidget from './components/TopCustomersWidget';

const App = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Xeno Retail Command Center</h1>
      </header>
      <main className="dashboard-content">
        <section className="kpi-section">
          <KeyMetricsWidget />
        </section>
        <section className="chart-section">
          <h2>Orders by Date</h2>
          <OrdersByDateWidget />
        </section>
        <section className="top-section">
          <h2>Top 5 Customers by Spend</h2>
          <TopCustomersWidget />
        </section>
      </main>
    </div>
  );
};

export default App;