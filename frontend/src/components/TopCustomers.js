import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TopCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IMPORTANT: If your backend is deployed, you need the full URL here, like:
    // axios.get('https://your-backend-name.onrender.com/api/insights/top-customers')
    axios.get('/api/insights/top-customers')
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the top customers!", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading Top Customers...</div>;
  }

  return (
    <div>
      <h3>Top 5 Customers by Spend</h3>
      <ol>
        {customers.map((customer, index) => (
          <li key={index}>
            {customer.first_name} {customer.last_name} - 
            <strong> ${parseFloat(customer.total_spend).toFixed(2)}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default TopCustomers;