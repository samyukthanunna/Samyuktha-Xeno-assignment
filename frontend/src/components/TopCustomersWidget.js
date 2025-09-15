// frontend/src/components/TopCustomersWidget.js

import React from 'react';

function TopCustomersWidget({ customers }) {
  if (!customers || customers.length === 0) {
    return (
      <div className="widget-container top-customers-widget">
        <h3>Top 5 Customers by Spend</h3>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="widget-container top-customers-widget">
      <h3>Top 5 Customers by Spend</h3>
      <ol className="top-customers-list">
        {customers.map((customer, index) => (
          <li key={index}>
            <span>{customer.first_name} {customer.last_name}</span>
            <strong>${parseFloat(customer.total_spend).toFixed(2)}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default TopCustomersWidget;