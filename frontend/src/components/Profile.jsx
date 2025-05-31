import { useState, useEffect } from "react";
import { LogOut, CheckIcon } from "lucide-react";
import profile from "../image/profile.svg";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Product from "../image/Product.svg";
import { BASE_URL } from "../config";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("information");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch(`${BASE_URL}/api/orders/manage`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            throw new Error("Unauthorized or Forbidden. Please log in again.");
          }
          throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        setOrders(data);
        console.log("Fetched user orders:", data);
      } catch (error) {
        console.error("Error fetching user orders:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Sidebar - User Profile */}
          <div className="border border-gray-200 rounded-lg bg-white p-4 sm:p-6">
            <div className="flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-6 w-full">
                <img
                  src={profile}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
                <h2
                  style={{ fontFamily: "La Mango" }}
                  className="mt-3 sm:mt-0 text-xl sm:text-2xl text-[#333] text-center sm:text-left"
                >
                  Hii, Krushant
                </h2>
              </div>

              <div className="w-full space-y-2">
                <button
                  className={`w-full py-3 text-center rounded-md cursor-pointer transition-colors ${
                    activeTab === "information" ? "bg-[#2c3118] text-white" : "text-[#333]"
                  }`}
                  onClick={() => setActiveTab("information")}
                >
                  My Information
                </button>
                <button
                  className={`w-full py-3 text-center rounded-md cursor-pointer transition-colors ${
                    activeTab === "order" ? "bg-[#2c3118] text-white" : "text-[#333]"
                  }`}
                  onClick={() => setActiveTab("order")}
                >
                  My Order
                </button>
                <div
                  className="mt-12 sm:mt-24 flex items-center justify-center gap-2 py-3 text-[#333] cursor-pointer hover:text-[#2c3118] transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 rotate-360" />
                  <span>Log Out</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Form or Order */}
          <div className="border border-gray-200 rounded-lg bg-white p-4 sm:p-6 lg:col-span-2">
            {activeTab === "information" ? (
              <UserInformationForm />
            ) : (
              <OrderTracking orders={orders} loading={loading} error={error} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function UserInformationForm() {
  return (
    <form className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
      {[
        { id: "firstName", label: "First Name", type: "text", placeholder: "Name" },
        { id: "lastName", label: "Last Name", type: "text", placeholder: "Name" },
        { id: "phone", label: "Phone Number", type: "tel", placeholder: "Number" },
        { id: "dob", label: "DOB", type: "text", placeholder: "12 / 12 / 2006" },
        { id: "email", label: "Email", type: "email", placeholder: "zulazandmore@gmail.com" },
        { id: "password", label: "Password", type: "password", placeholder: "**************" },
      ].map(({ id, label, type, placeholder }) => (
        <div key={id} className="space-y-1.5">
          <label htmlFor={id} className="block text-sm font-medium text-lime-950">
            {label}
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className="w-full rounded-md border border-lime-950 p-3 outline-none"
          />
        </div>
      ))}
    </form>
  );
}

function OrderTracking({ orders, loading, error }) {
  if (loading) return <p className="text-center font-medium">Loading orders...</p>;
  if (error) return <p className="text-center font-medium text-red-500">Error: {error}</p>;
  if (!orders || orders.length === 0) return <p className="text-center font-medium">No orders found.</p>;

  return (
    <div className="flex flex-col gap-8">
      {orders.map((order) => {
        const statusSteps = ["Ordered", "Shipping", "Out of delivery", "Delivered"];
        const statusMap = {
          pending: 0,
          confirmed: 0,
          shipping: 1,
          out_of_delivery: 2,
          delivered: 3,
        };
        const currentStatus = order.status || "pending";
        const statusIndex = statusMap[currentStatus] || 0;

        const trackingId = order.id.toString().padStart(16, "0");
        const productImage = order.items[0]?.productId
          ? `${BASE_URL}/api/products/image/${order.items[0].productId}`
          : Product;

        return (
          <div key={order.id} className="border-b border-gray-200 pb-8 mb-8">
            {/* Order Overview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-lime-950 mb-2">Order #{order.id}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.total.toFixed(2)}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Status:</strong>{" "}
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).replace(/_/g, " ")}
                  </p>
                  <p>
                    <strong>Tracking ID:</strong> {trackingId}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status Steps */}
            <div className="relative flex flex-col sm:flex-row justify-between mb-6">
              {/* Progress line for desktop */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 hidden sm:block">
                <div
                  className="h-full bg-[#2c3118]"
                  style={{ width: `${(statusIndex + 1) * (100 / statusSteps.length)}%` }}
                ></div>
              </div>

              {/* Progress line for mobile */}
              <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-200 sm:hidden">
                <div
                  className="w-full bg-[#2c3118]"
                  style={{ height: `${(statusIndex + 1) * (100 / statusSteps.length)}%` }}
                ></div>
              </div>

              {/* Status steps */}
              {statusSteps.map((step, idx) => (
                <StatusStep key={step} title={step} isCompleted={idx <= statusIndex} />
              ))}
            </div>

            {/* Delivery and Shipping Info */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div className="rounded-md border border-[#e5e0d5] bg-white p-4">
                <h3 className="mb-2 text-lg font-medium text-lime-950">Delivery by Kalateet</h3>
                <p className="text-gray-600 text-sm break-words">Tracking ID: {trackingId}</p>
              </div>
              <div className="rounded-md border border-[#e5e0d5] bg-white p-4">
                <h3 className="mb-2 text-lg font-medium text-lime-950">Shipping Address</h3>
                <p className="text-gray-600 text-sm">
                  {order.address}
                  {order.apartment && `, ${order.apartment}`}
                  <br />
                  {order.city}, {order.state} {order.zipCode}
                </p>
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-4">
              <h4 className="text-md font-semibold text-lime-950 mb-3">Products</h4>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 mb-4">
                    <img
                      src={item.productId ? `${BASE_URL}/api/products/image/${item.productId}` : Product}
                      alt={`Product ${item.productId}`}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Product ID: {item.productId}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ₹{item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No products found in this order.</p>
              )}
            </div>
          </div>
        );
      })}
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