import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Cartim from "../image/cartim.svg";
import { BASE_URL } from "../config";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online"); // Default payment method
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [orderData, setOrderData] = useState(null); // State to store orderData
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const items = searchParams.get("cartItems");
    const totalAmount = searchParams.get("total");

    if (items && totalAmount) {
      const parsedItems = JSON.parse(decodeURIComponent(items));
      setCartItems(parsedItems);

      // Fetch product details including images if not fully loaded
      const fetchProductImages = async () => {
        const updatedItems = await Promise.all(
          parsedItems.map(async (item) => {
            if (!item.product?.image1) {
              try {
                const response = await fetch(`${BASE_URL}/api/products/${item.productId}`, {
                  headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                });
                if (response.ok) {
                  const productData = await response.json();
                  return { ...item, product: { ...item.product, image1: productData.image1 || Cartim } };
                }
              } catch (error) {
                console.error("Error fetching product image:", error);
              }
            }
            return item;
          })
        );
        setCartItems(updatedItems);
      };

      fetchProductImages();
      setTotal(parseFloat(totalAmount));
    }
  }, [location.search]);

  const shipping = 20.00;
  const tax = 20.00;
  const grandTotal = total + shipping + tax;

  const getFirstImage = (item) => {
    const image = item.product?.image1 || item.image2 || item.image3 || item.image4 || item.image || Cartim;
    const fullImageUrl = typeof image === 'string' && image.startsWith('/uploads') ? `${BASE_URL}${image}` : image;
    console.log(`Getting image for ${item.product?.title || 'Unnamed'}: raw=${image}, full=${fullImageUrl}`);
    return fullImageUrl;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "") {
      alert("Please log in to place an order");
      return;
    }

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return;
    }

    // Validate phone number for Razorpay
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Create orderData and store it in state
    const newOrderData = {
      cartItems,
      total: grandTotal,
      paymentMethod,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      tax,
      shipping,
      subtotal: total,
    };
    setOrderData(newOrderData);

    // Log orderData to debug
    console.log("Order Data:", newOrderData);

    if (paymentMethod === "online") {
      // Razorpay integration
      const loadRazorpay = (src) => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        alert("Razorpay SDK failed to load. Check your internet connection.");
        return;
      }

      const razorpayResponse = await fetch(`${BASE_URL}/api/orders/razorpay`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total: grandTotal,
          paymentMethod: "online",
        }),
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        throw new Error(errorData.message || "Failed to create Razorpay order");
      }

      const { order } = await razorpayResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_GFyWZxg5tFOLm7",
        amount: order.amount,
        currency: order.currency,
        name: "Jhoola",
        description: "Order Payment",
        image: Cartim,
        order_id: order.id,
        handler: async function (response) {
          try {
            const paymentResponse = await fetch(`${BASE_URL}/api/orders`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...orderData, // Use orderData from state
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const data = await paymentResponse.json();
            if (paymentResponse.ok) {
              alert("Order placed successfully!");
              window.location.href = "/profile"; // Redirect to /profile
            } else {
              alert(data.message || "Order placement failed");
            }
          } catch (error) {
            console.error("Error processing payment:", error);
            alert("Error processing payment");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } else if (paymentMethod === "cod") {
      try {
        const response = await fetch(`${BASE_URL}/api/orders`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrderData),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Order placed successfully!");
          window.location.href = "/profile"; // Redirect to /profile
        } else {
          alert(data.message || "Order placement failed");
        }
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Error placing order");
      }
    }
  };

  return (
    <>
      <div className="bg-white">
        <Navbar />
        <div className="min-h-screen mt-2 md:mt-5 flex justify-center px-2 md:px-10">
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Contact and Payment Info */}
            <div className="bg-white p-6 rounded-lg shadow w-full md:w-[600px]">
              <h2 style={{ fontFamily: "La Mango" }} className="text-xl md:text-2xl text-center text-gray-700">
                Check Out
              </h2>
              <p className="text-sm text-gray-500 text-center mb-4">
                <Link to="/" className="hover:underline">Home</Link> / Check Out
              </p>

              {/* Contact Information */}
              <h3 className="mt-4 text-lg font-semibold text-gray-700">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <label className="block">
                  <span className="text-gray-700">First Name</span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="border border-gray-300 outline-none p-2 rounded w-full mt-1"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Last Name</span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="border border-gray-300 outline-none p-2 rounded w-full mt-1"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="border border-gray-300 outline-none p-2 rounded w-full mt-1"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="border border-gray-300 outline-none p-2 rounded w-full mt-1"
                    required
                  />
                </label>
              </div>

              {/* Shipping Address */}
              <h3 className="mt-6 text-lg font-semibold text-gray-700">Shipping Address</h3>
              <label className="block">
                <span className="text-gray-700">Address</span>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="border border-gray-300 outline-none p-2 rounded w-full mt-1"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Apartment, suite, etc (Optional)</span>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc."
                  className="border border-gray-300 outline-none p-2 rounded w-full mt-1"
                />
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <label className="block">
                  <span className="text-gray-700">City</span>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your City"
                    className="border border-gray-300 outline-none p-2 rounded w-full mt-1"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">State</span>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="border border-gray-300 outline-none p-2 rounded w-full mt-1"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="rajasthan">Rajasthan</option>
                    <option value="maharashtra">Maharashtra</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-gray-700">Zip Code</span>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Enter ZIP Code"
                    className="border border-gray-300 outline-none p-2 rounded w-full mt-1"
                    required
                  />
                </label>
              </div>

              {/* Payment Method */}
              <h3 className="mt-6 text-lg font-semibold text-gray-700">Payment Method</h3>
              <div className="p-4 rounded border border-gray-300 mt-2">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <span className="text-gray-700">Online Payment</span>
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span className="text-gray-700">Cash on Delivery</span>
                </label>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-white p-6 rounded-lg border border-gray-300 shadow w-full md:w-[300px]">
              <h3 className="text-lg font-semibold text-gray-700">Order Summary</h3>
              <div className="mt-4 space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <img
                      src={getFirstImage(item)}
                      alt={item.product?.title || "Product"}
                      className="w-12 h-12 rounded"
                    />
                    <span className="text-gray-700">{item.product?.title || "N/A"}</span>
                    <span className="text-gray-700">₹{(item.product?.price * item.quantity || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-700">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span className="text-gray-700">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax</span>
                  <span className="text-gray-700">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-700">Total</span>
                  <span className="text-gray-700">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handlePayment}
                className="w-full bg-lime-950 text-white py-2 rounded mt-4 hover:bg-lime-900"
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
              <p className="text-xs text-center text-gray-500 mt-2">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Checkout;