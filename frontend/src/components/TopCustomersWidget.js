import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TopCustomersWidget.css';

const TopCustomersWidget = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://samyuktha-xeno-assignment-ozpvf47mr-sams-projects-8338b950.vercel.app');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching top customers:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="top-customers-list">
      {customers.length > 0 ? (
        <ul>
          {customers.map((customer) => (
            <li key={customer.id}>
              <span className="customer-name">{customer.name}</span>
              <span className="customer-spend">${customer.totalSpend.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );
};

export default TopCustomersWidget;