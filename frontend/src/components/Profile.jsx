import { useState, useEffect } from "react";
import { LogOut, CheckIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL, userToken } from "./Variable";
import axios from "axios";
import toast from "react-hot-toast";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("information");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const userData = userToken();
  const token = userData?.token;

  // Load user data from localStorage on component mount
  useEffect(() => {
    if (!token) {
      navigate("/LoginPage");
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("zulas");
    navigate("/LoginPage");
  };

  // Toggle logout modal
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  // Get first letter of firstName for avatar
  const firstLetter = userData?.firstName
    ? userData?.firstName.charAt(0).toUpperCase()
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Sidebar */}
          <div className="border border-gray-200 rounded-lg bg-white p-4 sm:p-6">
            <div className="flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-6 w-full ">
                {/* Circle with first letter of email */}
                {userData?.firstName ? (
                  <div
                    className="flex items-center justify-center rounded-full bg-lime-950 text-white font-bold text-4xl w-24 h-24"
                    style={{ fontFamily: "La Mango" }}
                  >
                    {firstLetter}
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold text-4xl w-24 h-24"
                    style={{ fontFamily: "La Mango" }}
                  >
                    ?
                  </div>
                )}

                {/* Show full user name or email */}
                <h2
                  style={{ fontFamily: "La Mango" }}
                  className="mt-3 sm:mt-0 text-xl sm:text-2xl text-[#333] text-center sm:text-left"
                >
                  {userData
                    ? `${userData?.firstName || ""} ${
                        userData?.lastName || ""
                      }`.trim() || userData?.email
                    : "Guest"}
                </h2>
              </div>

              <div className="w-full space-y-2  ">
                <button
                  className={`w-full py-3 text-center rounded-md cursor-pointer transition-colors ${
                    activeTab === "information"
                      ? "bg-[#2c3118] text-white"
                      : "text-[#333]"
                  }`}
                  onClick={() => setActiveTab("information")}
                >
                  My Information
                </button>
                <button
                  className={`w-full py-3 text-center rounded-md cursor-pointer transition-colors ${
                    activeTab === "order"
                      ? "bg-[#2c3118] text-white"
                      : "text-[#333]"
                  }`}
                  onClick={() => setActiveTab("order")}
                >
                  My Order
                </button>
                <div
                  className="flex items-center justify-center gap-2 py-3 text-[#333] cursor-pointer hover:text-[#2c3118] transition-colors"
                  onClick={openLogoutModal}
                >
                  <LogOut className="h-4 w-4 rotate-360" />
                  <span>Log Out</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="border border-gray-200 rounded-lg bg-white p-4 sm:p-6 lg:col-span-2">
            {activeTab === "information" ? (
              <UserInformationForm user={userData} />
            ) : (
              <OrderTracking
                userId={userData?.userId}
                token={userData?.token}
              />
            )}
          </div>
        </div>
      </div>
      {isLogoutModalOpen && (
        <LogoutModal onConfirm={handleLogout} onCancel={closeLogoutModal} />
      )}
    </div>
  );
}

function UserInformationForm({ user }) {
  return (
    <form className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
      {[
        {
          id: "firstName",
          label: "First Name",
          type: "text",
          placeholder: "Name",
          value: user?.firstName || "",
        },
        {
          id: "lastName",
          label: "Last Name",
          type: "text",
          placeholder: "Name",
          value: user?.lastName || "",
        },
        {
          id: "phone",
          label: "Phone Number",
          type: "tel",
          placeholder: "Number",
          value: user?.phone || "", // Assuming you have phone in user data, else empty
        },
        {
          id: "dob",
          label: "DOB",
          type: "text",
          placeholder: "12 / 12 / 2006",
          value: user?.dob || "", // Assuming dob is available
        },
        {
          id: "email",
          label: "Email",
          type: "email",
          placeholder: "zulazandmore@gmail.com",
          value: user?.email || "",
        },
        {
          id: "password",
          label: "Password",
          type: "password",
          placeholder: "**************",
          value: "********", // Never show real password
        },
      ].map(({ id, label, type, placeholder, value }) => (
        <div key={id} className="space-y-1.5">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-lime-950"
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            defaultValue={value}
            className="w-full rounded-md border border-lime-950 p-3 outline-none"
            readOnly={id === "email"} // For example make email readonly
          />
        </div>
      ))}
    </form>
  );
}

function OrderTracking({ userId, token }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const IMAGE_BASE_URL = `${API_URL}/uploads/`;

  // Fetch user orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/order/getuserorder/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("order", response.data);

        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    if (userId && token) {
      fetchOrders();
    }
  }, [userId, token]);

  // Fetch order details when an order is selected
  const handleOrderClick = async (orderId) => {
    try {
      const response = await axios.get(
        `${API_URL}/order/getorderbyid/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("response", response.data);

      setSelectedOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    }
  };

  // Map status numbers to titles
  const statusMap = {
    1: "Ordered",
    2: "Shipping",
    3: "Out for Delivery",
    4: "Delivered",
    5: "Cancelled",
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
      isCompleted: index <= currentIndex && status !== 5, // Cancelled orders show no progress
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : !selectedOrder ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-lime-950">My Orders</h3>
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleOrderClick(order.orderId)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {statusMap[order.status] || "Unknown"}
                  </p>
                </div>
                <p className="font-bold">₹{order.grandTotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <button
            className="text-lime-950 hover:underline"
            onClick={() => setSelectedOrder(null)}
          >
            ← Back to Orders
          </button>
          <div className="relative flex flex-col sm:flex-row justify-between">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 hidden sm:block">
              <div
                className="h-full bg-[#2c3118]"
                style={{
                  width: `${
                    (getStatusProgress(selectedOrder.status).filter(
                      (s) => s.isCompleted
                    ).length /
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
                    (getStatusProgress(selectedOrder.status).filter(
                      (s) => s.isCompleted
                    ).length /
                      4) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            {getStatusProgress(selectedOrder.status).map((step, index) => (
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
                Tracking ID: {selectedOrder.orderId || "N/A"}
              </p>
            </div>
            <div className="rounded-md border border-[#e5e0d5] bg-white p-4">
              <h3 className="mb-2 text-lg font-medium text-lime-950">
                Shipping Address
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedOrder.firstName} {selectedOrder.lastName}
                <br />
                {selectedOrder.address}
                {selectedOrder.apt ? `, ${selectedOrder.apt}` : ""}
                <br />
                {selectedOrder.city}, {selectedOrder.state},
                {selectedOrder.postalCode}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-lime-950">Order Items</h3>
            {selectedOrder?.orderItems.map((item) => (
              <div
                key={item.orderItemId}
                className="flex gap-4 border border-[#e5e0d5] rounded-md p-4"
              >
                <img
                  src={
                    item.product?.productImages[0]
                      ? `${IMAGE_BASE_URL}${item.product.productImages[0].imageUrl}`
                      : "/placeholder.svg"
                  }
                  alt={item.Product?.name}
                  className="h-24 w-24 object-cover rounded-md"
                />
                <div>
                  <h4 className="font-medium">{item.product?.name}</h4>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-bold">
                    ₹{item.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md mx-4 animate-modal-in">
        <div className="flex justify-between items-center mb-4">
          <h3
            style={{ fontFamily: "La Mango" }}
            className="text-xl sm:text-2xl text-lime-950"
          >
            Confirm Logout
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Are you sure you want to log out? You’ll need to log in again to
          access your profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-lime-950 text-lime-950 rounded-md hover:bg-gray-100 transition-colors sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-lime-950 text-white rounded-md hover:bg-[#2c3118] transition-colors sm:text-sm"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
