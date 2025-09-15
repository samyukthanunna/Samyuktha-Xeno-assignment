// src/components/OrdersByDateWidget.js
import React from 'react';

const OrdersByDateWidget = ({ orders, startDate, setStartDate, endDate, setEndDate, onFilter }) => (
  <div className="bento-box widget-orders">
    <h3>Orders by Date</h3>
    <div className="filter-bar">
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <span>to</span>
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <button onClick={onFilter}>Filter</button>
    </div>
    <table>
      <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th></tr></thead>
      <tbody>
        {orders && orders.length > 0 ? orders.map(order => (
          <tr key={order.shopifyOrderId}>
            <td>#{order.shopifyOrderId.toString()}</td>
            <td>{order.customer.firstName} {order.customer.lastName}</td>
            <td>{new Date(order.processedAt).toLocaleDateString()}</td>
            <td>${parseFloat(order.totalPrice).toFixed(2)}</td>
          </tr>
        )) : <tr><td colSpan="4">No orders in this date range.</td></tr>}
      </tbody>
    </table>
  </div>
);

export default OrdersByDateWidget;