import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import './App.css';

// --- Login Component ---
function Login() {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    // This is a mock login. In a real app, you would verify credentials.
    // We will store a fake auth status to simulate being logged in.
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Dashboard Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ margin: '10px' }}>
          <input type="email" defaultValue="test@example.com" style={{ padding: '8px' }} />
        </div>
        <div style={{ margin: '10px' }}>
          <input type="password" defaultValue="password" style={{ padding: '8px' }}/>
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
      </form>
    </div>
  );
}

// --- Dashboard Component ---
function Dashboard() {
  return (
    <div>
      <h1>Customer Dashboard</h1>
      <hr />
      <TopCustomersList />
      <CustomerSpendChart />
    </div>
  );
}

// --- Data Fetching and Chart Components ---
function TopCustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!BACKEND_URL) {
      setError("Error: Backend URL is not configured in Vercel.");
      setLoading(false);
      return;
    }
    const fetchTopCustomers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/insights/top-customers`);
        if (!response.ok) {
          throw new Error(`Failed to fetch (Status: ${response.status})`);
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCustomers();
  }, [BACKEND_URL]);

  return (
    <div>
      <h3>Top 5 Customers by Spend</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {customers.length > 0 ? customers.map(customer => (
          <li key={customer.id}>
            {customer.first_name} {customer.last_name} - Total Spend: ${customer.total_spend.toFixed(2)}
          </li>
        )) : !loading && !error && <p>No customer data found.</p>}
      </ul>
    </div>
  );
}

function CustomerSpendChart() {
  const [chartData, setChartData] = useState([]);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!BACKEND_URL) return;
    const fetchChartData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/insights/top-customers`);
        const data = await response.json();
        const formattedData = data.map(c => ({ name: c.first_name, spend: c.total_spend }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };
    fetchChartData();
  }, [BACKEND_URL]);

  return (
    <div style={{ marginTop: '40px', color: 'white' }}>
      <h3>Top Customer Spend Visualized</h3>
      <ResponsiveContainer width="80%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#FFF" />
          <YAxis stroke="#FFF" />
          <Tooltip />
          <Legend />
          <Bar dataKey="spend" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- Main App Router ---
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
