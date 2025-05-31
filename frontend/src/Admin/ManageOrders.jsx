import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminEmail = 'admin'; // Confirmed
  const adminPassword = 'admin123'; // Confirmed

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/orders?email=${adminEmail}&password=${adminPassword}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
      console.log('Fetched admin orders:', data);
    } catch (error) {
      console.error('Error fetching admin orders:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/update-status?email=${adminEmail}&password=${adminPassword}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Status updated:', data);
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating status:', error.message);
      alert('Failed to update status');
    }
  };

  if (loading) return <p className="text-center font-medium">Loading orders...</p>;
  if (error) return <p className="text-center font-medium text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 ml-64">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      {orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>User ID:</strong> {order.userId}</p>
                  <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  <p><strong>Customer:</strong> {order.firstName} {order.lastName}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p><strong>Address:</strong> {order.address}, {order.apartment || "N/A"}, {order.city}, {order.state}, {order.zipCode}</p>
                </div>
                <div>
                  <p><strong>Subtotal:</strong> ₹{order.subtotal.toFixed(2)}</p>
                  <p><strong>Tax:</strong> ₹{order.tax.toFixed(2)}</p>
                  <p><strong>Shipping:</strong> ₹{order.shipping.toFixed(2)}</p>
                  <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><strong>Razorpay Payment ID:</strong> {order.razorpay_payment_id || "N/A"}</p>
                  <p><strong>Razorpay Order ID:</strong> {order.razorpay_order_id || "N/A"}</p>
                  <p><strong>Razorpay Signature:</strong> {order.razorpay_signature || "N/A"}</p>
                  <p><strong>Items:</strong> {order.items.map(item => `${item.quantity}x Product ID: ${item.productId} (₹${item.price.toFixed(2)})`).join(', ')}</p>
                </div>
              </div>
              <div className="mt-2">
                <label className="mr-2">Update Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipping">Shipping</option>
                  <option value="out_of_delivery">Out of Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center font-medium">No orders found.</p>
      )}
    </div>
  );
};

export default ManageOrders;