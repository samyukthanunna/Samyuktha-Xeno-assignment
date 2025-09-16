import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import './App.css';

// THIS IS OUR FAKE DATA
const mockData = [
  { id: '1', first_name: 'John', last_name: 'Doe', total_spend: 1250.75 },
  { id: '2', first_name: 'Jane', last_name: 'Smith', total_spend: 1100.50 },
  { id: '3', first_name: 'Sam', last_name: 'Wilson', total_spend: 980.00 },
  { id: '4', first_name: 'Peter', last_name: 'Jones', total_spend: 850.25 },
  { id: '5', first_name: 'Mary', last_name: 'Brown', total_spend: 760.00 },
];

function TopCustomersList() {
  return (
    <div>
      <h3>Top 5 Customers by Spend</h3>
      <ul>
        {mockData.map(customer => (
          <li key={customer.id}>
            {customer.first_name} {customer.last_name} - Total Spend: ${customer.total_spend.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CustomerSpendChart() {
  const chartData = mockData.map(c => ({
    name: `${c.first_name}`,
    spend: c.total_spend,
  }));

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>Top Customer Spend Visualized</h3>
      <ResponsiveContainer width="80%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="spend" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer Dashboard</h1>
        <hr />
        <TopCustomersList />
        <CustomerSpendChart /> 
      </header>
    </div>
  );
}

export default App;
