import React, { useState, useEffect } from 'react';

function TopCustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // IMPORTANT: This uses the Environment Variable we set up
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // If the BACKEND_URL isn't set, we can avoid an error.
    if (!BACKEND_URL) {
      setError("Backend URL is not configured.");
      setLoading(false);
      return;
    }

    const fetchTopCustomers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/insights/top-customers`);
        if (!response.ok) {
          throw new Error(`Network response was not ok (Status: ${response.status})`);
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
  }, [BACKEND_URL]); // Effect runs when BACKEND_URL is available

  return (
    <div>
      <h2>Top 5 Customers</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {customers.length > 0 ? (
            customers.map(customer => (
              <li key={customer.id}>
                {customer.first_name} {customer.last_name} - Total Spend: ${customer.total_spend.toFixed(2)}
              </li>
            ))
          ) : (
            <p>No customer data found.</p>
          )}
        </ul>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer Dashboard</h1>
        <TopCustomersList />
      </header>
    </div>
  );
}

export default App;
