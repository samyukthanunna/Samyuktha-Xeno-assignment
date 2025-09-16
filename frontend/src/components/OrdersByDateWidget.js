import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const OrdersByDateWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://samyuktha-xeno-assignment-ozpvf47mr-sams-projects-8338b950.vercel.app');
        const formattedData = response.data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          count: parseInt(item.count, 10),
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OrdersByDateWidget;