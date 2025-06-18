import React, { useEffect, useState } from "react";
import "./admindashboard.css";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaBox,
} from "react-icons/fa";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0,
  });

  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const orders = await fetch("http://localhost:5000/api/orders/count").then(res => res.json());
        const users = await fetch("http://localhost:5000/api/users/count").then(res => res.json());
        const revenue = await fetch("http://localhost:5000/api/orders/revenue").then(res => res.json());

        setStats({
          totalOrders: orders.count,
          totalUsers: users.count,
          revenue: revenue.revenue,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Dummy data for the chart
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Revenue Over Time',
        data: [1200, 1900, 3000, 5000, 2000, 3000], // Replace with dynamic data
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="admin-container">
      <div className="top-bar">
        <h1>Admin Dashboard</h1>
      </div>

      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <ul className="nav-links">
          <li><Link to="/dashboard"><FaChartBar /> Dashboard</Link></li>
          <li><Link to="/orders"><FaShoppingCart /> Orders</Link></li>
          <li><Link to="/users"><FaUsers /> Users</Link></li>
          <li><Link to="/products"><FaBox /> Products</Link></li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <div className="overview-container">
          <div className="stat-box">
            <FaShoppingCart className="stat-icon" />
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="stat-box">
            <FaUsers className="stat-icon" />
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-box">
            <FaChartBar className="stat-icon" />
            <h3>Total Revenue</h3>
            <p>Rs {stats.revenue}</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="chart-container">
          <h2>Revenue Over Time</h2>
          <Line data={chartData} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
