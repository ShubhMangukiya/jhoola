import { BASE_URL } from "../config"; // Correct global import
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersStats, setOrdersStats] = useState({
    total: 0,
    status: { pending: 0, fulfilled: 0, delivered: 0, rejected: 0 },
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/login');
    } else {
      fetchDashboardData();
      fetchOrdersData();
    }
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get(`${BASE_URL}/public/users/count`),
        axios.get(`${BASE_URL}/public/products/count`),
        axios.get(`${BASE_URL}/public/orders/stats`),
      ]);

      setUsersCount(usersRes.data.count || 0);
      setProductsCount(productsRes.data.count || 0);
      setOrdersStats(ordersRes.data || {
        total: 0,
        status: { pending: 0, fulfilled: 0, delivered: 0, rejected: 0 },
      });

    } catch (err) {
      setError(err.response?.data?.message || "Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data.data)) {
        setOrders(res.data.data);
        setSuccessMessage('Orders loaded successfully');
      } else {
        throw new Error('Unexpected response format');
      }

    } catch (err) {
      setError(err.response?.data?.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`${BASE_URL}/orders/update-status/${orderId}`, { status: newStatus });
      setSuccessMessage(res.data.message);
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update status`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('authUpdated'));
    navigate('/login');
  };

  const chartData = {
    labels: ['Pending', 'Fulfilled', 'Delivered', 'Rejected'],
    datasets: [{
      label: 'Order Status',
      data: [
        ordersStats.status.pending,
        ordersStats.status.fulfilled,
        ordersStats.status.delivered,
        ordersStats.status.rejected,
      ],
      backgroundColor: [
        'rgba(255,99,132,0.6)',
        'rgba(54,162,235,0.6)',
        'rgba(75,192,192,0.6)',
        'rgba(153,102,255,0.6)',
      ],
    }],
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#754F23]">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-[#754F23]">Users</h2>
          <p className="text-2xl">{usersCount}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-[#754F23]">Products</h2>
          <p className="text-2xl">{productsCount}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-[#754F23]">Orders</h2>
          <p className="text-2xl">{ordersStats.total}</p>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Status Overview</h2>
        <div className="w-full h-64">
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
        {orders.length === 0 ? (
          <p>No orders available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Order ID</th>
                  <th className="py-2 px-4 border">User ID</th>
                  <th className="py-2 px-4 border">Total</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="py-2 px-4 border">{order.id}</td>
                    <td className="py-2 px-4 border">{order.userId}</td>
                    <td className="py-2 px-4 border">₹{order.totalPrice}</td>
                    <td className="py-2 px-4 border">{order.status}</td>
                    <td className="py-2 px-4 border">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="delivered">Delivered</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
