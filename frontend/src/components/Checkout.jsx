import { Link, useLocation, useNavigate } from "react-router-dom";
import Cartim from "../image/Cartim.svg";
import { API_URL, userToken } from "./Variable";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const userData = userToken();
  const userId = userData?.userId;
  const token = userData?.token;

  const { cartItems } = location.state || {
    cartItems: [],
  };

  const directProduct = location.state?.product || null;

  const finalCartItems = directProduct
    ? [{ ...directProduct, quantity: 1 }]
    : cartItems;

  const subtotal = finalCartItems?.reduce((sum, item) => {
    const product = item.product || item; //Cart se hai to item.product, Buy Now se hai to item
    return sum + (product.price || item.price) * (item.quantity || 1);
  }, 0);

  console.log("final", finalCartItems);

  const shipping = 20;
  const tax = 20;
  const grandTotal = subtotal + shipping + tax;

  const placeOrder = async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/order/create`, orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Order placed successfully!");
      navigate("/order-success", {
        state: {
          order: {
            orderId: response.data.orderId,
            items: finalCartItems.map((item) => {
              const product = item.product || item;
              return {
                name: product.name,
                image: product.images?.[0] || "default-image.jpg",
                quantity: item.quantity || 1,
                price: product.price,
              };
            }),
            total: response.data.grandTotal,
            deliveryDate: new Date(
              Date.now() + 5 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Failed to place order";
      throw new Error(message);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Please log in to place an order");
      toast.error("Please log in to place an order");
      setLoading(false);
      return;
    }

    if (finalCartItems.length === 0) {
      setError("Your cart is empty");
      toast.error("Your cart is empty");
      setLoading(false);
      return;
    }

    const orderData = {
      userId,
      shippingCharge: shipping,
      tax: tax,
      totalPrice: subtotal,
      grandTotal,
      paymentMethod,
      formData,
      status: 1,
      orderItems: finalCartItems.map((item) => {
        const product = item.product || item;
        const productId = item.productId || product.id;
        const price = product.price;
        const quantity = item.quantity || 1;

        return {
          productId,
          quantity,
          price,
          totalAmount: quantity * price,
        };
      }),
    };

    try {
      if (paymentMethod === "online") {
        // Load Razorpay SDK
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          throw new Error("Failed to load Razorpay SDK");
        }

        // Create Razorpay order
        const razorpayRes = await axios.post(
          `${API_URL}/razorpay/create-razorpay-order`,
          { totalPrice: grandTotal },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { orderId, key, amount, currency } = razorpayRes.data;

        // Initialize Razorpay Checkout
        const options = {
          key,
          amount,
          currency,
          order_id: orderId,
          name: "Zulas And More",
          description: "Order Payment",
          handler: async function (response) {
            try {
              // Verify payment
              const verifyResponse = await axios.post(
                `${API_URL}/razorpay/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (verifyResponse.data.success) {
                // Payment verified, place order with Razorpay details
                const updatedOrderData = {
                  ...orderData,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  paymentStatus: "Paid",
                };

                await placeOrder(updatedOrderData);
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (err) {
              const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to verify payment";
              setError(message);
              toast.error(message);
              console.error("Payment verification error:", err);
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#58281C" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => {
          setError("Payment failed. Please try again.");
          toast.error("Payment failed. Please try again.");
          setLoading(false);
        });
        rzp.open();
      } else {
        // Cash on delivery
        await placeOrder(orderData);
        setLoading(false);
      }
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Failed to place order";
      setError(message);
      toast.error(message);
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white ">
        <div className="min-h-screen mt-2 md:mt-5 flex justify-center px-2 md:px-10">
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white p-6 rounded-lg">
              <h2
                style={{ fontFamily: "La Mango" }}
                className="text-xl md:text-2xl text-center"
              >
                Check Out
              </h2>
              <p className="text-sm text-gray-500  text-center">
                <Link to="/" className="hover:underline">
                  Home{" "}
                </Link>
                / Check Out
              </p>
              <h3 className="mt-4 md:mt-6 text-lg font-semibold">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <label>
                  First Name
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="border border-gray-300 outline-none p-2 rounded w-full"
                  />
                </label>
                <label>
                  Last Name
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="border border-gray-300 outline-none p-2 rounded w-full"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="border border-gray-300 outline-none p-2 rounded w-full"
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="border border-gray-300 outline-none p-2 rounded w-full"
                  />
                </label>
              </div>

              <h3 className="mt-4 md:mt-6 text-lg font-semibold pb-2">
                Shipping Address
              </h3>
              <label>
                Address
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="border border-gray-300 outline-none p-2 rounded w-full mt-2 mb-2"
                />
              </label>
              <label>
                Apartment, suite, etc(Optional){" "}
                <input
                  type="text"
                  id="apt"
                  name="apt"
                  value={formData.apt}
                  onChange={handleChange}
                  placeholder="Apartment, suite, etc."
                  className="border border-gray-300 outline-none p-2 rounded w-full mt-2"
                />
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <label>
                  City
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your City"
                    className="border border-gray-300 outline-none p-2 rounded w-full"
                  />
                </label>
                <label>
                  State
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="border border-gray-300 outline-none p-2 rounded w-full"
                  >
                    <option value>Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Andaman and Nicobar Islands">
                      Andaman and Nicobar Islands
                    </option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli and Daman and Diu">
                      Dadra and Nagar Haveli and Daman and Diu
                    </option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
                </label>
                <label>
                  Zip Code
                  <input
                    type="text"
                    id="zipCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter ZIP Code"
                    className="border border-gray-300 outline-none p-2 rounded w-full"
                  />
                </label>
              </div>

              <h3 className="mt-4 md:mt-6 text-lg font-semibold">
                Payment Method
              </h3>
              <div className="p-4 rounded flex flex-col gap-4 border border-gray-300 outline-none w-full">
                <label className=" p-2 flex items-center gap-4 border border-gray-300 ">
                  <input
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>
                <label className="p-2 flex items-center gap-4 border border-gray-300 ">
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Online Payment
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-300 h-fit md:mt-20 mb-2">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <div className="mt-4 space-y-4">
                {finalCartItems?.map((item) => {
                  const product = item.product || item;
                  return (
                    <div
                      key={product.productId || item.cartId}
                      className="flex justify-between items-center"
                    >
                      <img
                        src={
                          item.productImages?.[0]?.imageUrl
                            ? `${API_URL}/Uploads/${product.productImages[0].imageUrl}`
                            : Cartim || "/placeholder.svg"
                        }
                        alt={product.name}
                        className="w-12 h-12 rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                          console.error("Image load error:", e);
                        }}
                      />
                      <span className="flex-1 mx-4 truncate">
                        {product.name}{" "}
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity || 1} × ₹
                          {product.price?.toFixed(2) || "0.00"}
                        </p>
                      </span>
                      <span>
                        ₹{(product.price * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link to="/Orderconform">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-lime-950 text-white p-3 rounded mt-4"
                >
                  Place Order
                </button>
              </Link>
              <p className="text-xs text-center text-gray-500 mt-2">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
