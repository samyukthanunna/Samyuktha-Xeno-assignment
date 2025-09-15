// src/components/TopCustomersWidget.js
import React from 'react';

const TopCustomersWidget = ({ customers }) => (
  <div className="bento-box widget-top-customers">
    <h3>Top 5 Customers by Spend</h3>
    <ul>
      {customers && customers.length > 0 ? customers.map((customer, index) => (
        <li key={customer.id || index}>
          <span>{customer.firstName} {customer.lastName}</span>
          <span className="count">${parseFloat(customer.totalSpent).toFixed(2)}</span>
        </li>
      )) : <p>No customer data.</p>}
    </ul>
  </div>
);

export default TopCustomersWidget;