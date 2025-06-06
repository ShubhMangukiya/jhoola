import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, CheckIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL, userToken } from "../../components/Variable";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const navigate = useNavigate();
  const userData = userToken();
  const token = userData?.token;
  const IMAGE_BASE_URL = `${API_URL}/Uploads/`;

  // Status mapping
  const statusMap = {
    1: "Ordered",
    2: "Shipping",
    3: "Out for Delivery",
    4: "Delivered",
    5: "Cancelled",
  };

  // Fetch all orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/order/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      fetchOrders();
    } else {
      toast.error("Authentication required");
      navigate("LoginPage");
    }
  }, [token, navigate]);

  // Fetch order details when an order is expanded
  const toggleOrderDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Collapse if already expanded
      return;
    }
    setExpandedOrderId(orderId);
    if (!orderDetails[orderId]) {
      try {
        const response = await axios.get(
          `${API_URL}/order/getorderbyid/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrderDetails((prev) => ({ ...prev, [orderId]: response.data }));
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to load order details");
        setExpandedOrderId(null);
      }
    }
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/order/updatestatus/${orderId}`,
        { status: parseInt(newStatus) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, status: parseInt(newStatus) }
            : order
        )
      );
      // Update order details if loaded
      if (orderDetails[orderId]) {
        setOrderDetails((prev) => ({
          ...prev,
          [orderId]: { ...prev[orderId], status: parseInt(newStatus) },
        }));
      }
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  // Determine status completion for progress bar
  const getStatusProgress = (status) => {
    const statusOrder = [
      "Ordered",
      "Shipping",
      "Out for Delivery",
      "Delivered",
    ];
    const currentIndex = statusOrder.indexOf(statusMap[status]);
    return statusOrder.map((title, index) => ({
      title,
      isCompleted: index <= currentIndex && status !== 5,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1
          style={{ fontFamily: "La Mango" }}
          className="text-3xl font-serif mb-6 text-center text-lime-950"
        >
          Admin - Manage Orders
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-[#2c3118] text-white">
                  <th className="p-3 text-left font-semibold">Order ID</th>
                  <th className="p-3 text-left font-semibold">Customer</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-left font-semibold">Total</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <>
                    <tr
                      key={order.orderId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3">#{order.orderId}</td>
                      <td className="p-3">
                        {order.firstName} {order.lastName}
                      </td>
                      <td className="p-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">₹{order.grandTotal.toFixed(2)}</td>
                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.orderId, e.target.value)
                          }
                          className="border border-lime-950 rounded-md p-1 outline-none"
                        >
                          {Object.entries(statusMap).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleOrderDetails(order.orderId)}
                          className="text-lime-950 hover:text-[#2c3118]"
                          title={
                            expandedOrderId === order.orderId
                              ? "Hide Details"
                              : "Show Details"
                          }
                        >
                          {expandedOrderId === order.orderId ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order.orderId &&
                      orderDetails[order.orderId] && (
                        <tr>
                          <td colSpan="6" className="p-4 bg-gray-50">
                            <div className="space-y-6">
                              <div className="relative flex flex-col sm:flex-row justify-between">
                                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 hidden sm:block">
                                  <div
                                    className="h-full bg-[#2c3118]"
                                    style={{
                                      width: `${
                                        (getStatusProgress(
                                          orderDetails[order.orderId].status
                                        ).filter((s) => s.isCompleted).length /
                                          4) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-200 sm:hidden">
                                  <div
                                    className="w-full bg-[#2c3118]"
                                    style={{
                                      height: `${
                                        (getStatusProgress(
                                          orderDetails[order.orderId].status
                                        ).filter((s) => s.isCompleted).length /
                                          4) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                {getStatusProgress(
                                  orderDetails[order.orderId].status
                                ).map((step, index) => (
                                  <StatusStep
                                    key={index}
                                    title={step.title}
                                    isCompleted={step.isCompleted}
                                  />
                                ))}
                              </div>
                              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                <div className="rounded-md border border-[#e5e0d5] bg-white p-4">
                                  <h3 className="mb-2 text-lg font-medium text-lime-950">
                                    Delivery by Kalateet
                                  </h3>
                                  <p className="text-gray-600 text-sm break-words">
                                    Tracking ID:{" "}
                                    {orderDetails[order.orderId]
                                      .razorpay_order_id || "N/A"}
                                  </p>
                                </div>
                                <div className="rounded-md border border-[#e5e0d5] bg-white p-4">
                                  <h3 className="mb-2 text-lg font-medium text-lime-950">
                                    Shipping Address
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    {orderDetails[order.orderId].firstName}{" "}
                                    {orderDetails[order.orderId].lastName}
                                    <br />
                                    {orderDetails[order.orderId].address}
                                    {orderDetails[order.orderId].apt
                                      ? `, ${orderDetails[order.orderId].apt}`
                                      : ""}
                                    <br />
                                    {orderDetails[order.orderId].city},{" "}
                                    {orderDetails[order.orderId].state}{" "}
                                    {orderDetails[order.orderId].postalCode}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium text-lime-950">
                                  Order Items
                                </h3>
                                {orderDetails[order.orderId].orderItems.map(
                                  (item) => (
                                    <div
                                      key={item.orderItemId}
                                      className="flex gap-4 border border-[#e5e0d5] rounded-md p-4"
                                    >
                                      <img
                                        src={
                                          item.product.productImages[0]
                                            ? `${IMAGE_BASE_URL}${item.product.productImages[0].imageUrl}`
                                            : "/placeholder.svg"
                                        }
                                        alt={item.product.name}
                                        className="h-24 w-24 object-cover rounded-md"
                                      />
                                      <div>
                                        <h4 className="font-medium">
                                          {item.product.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                          Quantity: {item.quantity}
                                        </p>
                                        <p className="text-sm font-bold">
                                          ₹{item.totalAmount.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusStep({ title, isCompleted }) {
  return (
    <div className="flex sm:flex-col items-start sm:items-center mb-6 sm:mb-0 pl-12 sm:pl-0 relative z-10">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          isCompleted ? "bg-[#2c3118]" : "border border-gray-300 bg-white"
        }`}
      >
        {isCompleted ? (
          <CheckIcon className="h-6 w-6 text-white" />
        ) : (
          <span className="text-transparent">.</span>
        )}
      </div>
      <span className="ml-3 sm:ml-0 sm:mt-2 text-sm">{title}</span>
    </div>
  );
}
