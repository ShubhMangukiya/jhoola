import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cartim from "../image/Cartim.svg";
import { API_URL, userToken } from "./Variable";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const userData = userToken();
  const userId = userData?.userId;
  const token = userData?.token;

  const shipping = 20.0;
  const tax = 20.0;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/cart/getallcart/${userId}`
        );
        console.log("cartitems", response.data);

        setCartItems(response.data);
      } catch (error) {
        setCartItems([]);
        console.log(error);
      }
    };
    fetchCart();
  }, []);

  const calculateTotalPrice = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
    setTotalPrice(subtotal);
  };
  console.log("total", totalPrice);

  useEffect(() => {
    calculateTotalPrice(cartItems);
  }, [cartItems]);

  // Calculate total
  const total = totalPrice + shipping + tax;

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return handleRemoveItem(cartId);
    try {
      if (!token) {
        toast.error("Please log in to update the cart.");
        return;
      }
      await axios.put(
        `${API_URL}/cart/update/${cartId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${userData?.token}` } }
      );
      const updatedItems = cartItems?.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating cart");
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      if (!token) {
        toast.error("Please log in to remove items from the cart.");
        return;
      }
      await axios.delete(`${API_URL}/cart/remove/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedItems = cartItems.filter((item) => item.cartId !== cartId);
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
      toast.success("Product Has Been Remove From Cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error removing item");
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!token) {
      toast.error("Please log in to proceed to checkout.");
      return;
    }
    navigate("/checkout", { state: { cartItems } });
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
  };

if (!userId || !token) {
  return (
    <>
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center py-16 space-y-6">
          {/* Title + Breadcrumb */}
          <div>
            <h2
              style={{ fontFamily: "La Mango" }}
              className="text-3xl md:text-4xl font-semibold text-lime-950"
            >
              Your Cart is Waiting!
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              <Link to="/" className="hover:underline text-lime-700">
                Home
              </Link>{" "}
              / Cart Page
            </p>
          </div>
          {/* Message */}
          <p className="text-base sm:text-lg text-gray-700 max-w-md mx-auto">
            Please log in to access your cart and continue shopping your favorite picks.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/LoginPage">
              <button className="px-6 py-3 bg-lime-950 text-white rounded-lg shadow hover:bg-[#2c3118] hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
                Login to Your Account
              </button>
            </Link>
            <Link to="/Signup">
              <button className="px-6 py-3 bg-white border border-lime-950 text-lime-950 rounded-lg hover:bg-lime-950 hover:text-white transition-all duration-300 text-sm sm:text-base">
                Create an Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}


if (cartItems.length === 0) {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Title & Breadcrumb */}
        <div>
          <h2
            style={{ fontFamily: "La Mango" }}
            className="text-3xl md:text-4xl font-semibold text-lime-950"
          >
            Your Cart is Empty
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:underline text-lime-700">
              Home
            </Link>{" "}
            / Cart Page
          </p>
        </div>

        {/* Icon or Illustration */}
        <div className="flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="w-40 h-40 opacity-80"
          />
        </div>

        {/* Message & Button */}
        <div className="space-y-4">
          <p className="text-lg text-gray-700">Looks like your cart is feeling a little lonely.</p>
          <Link to="/Allproduct">
            <button className="inline-block px-6 py-3 bg-lime-950 text-white text-sm font-medium rounded-lg hover:bg-[#2c3118] transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 ">
          {/* Breadcrumb & Title */}
          <h2
            style={{ fontFamily: "La Mango" }}
            className="text-xl sm:text-2xl lg:text-3xl text-lime-950 mb-2 text-center"
          >
            Cart Page
          </h2>
          <p className="text-sm text-lime-950 mb-6 text-center">
            <Link to="/" className="hover:underline">
              Home{" "}
            </Link>{" "}
            / Cart Page
          </p>

          {/* Cart & Order Summary */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Cart Section */}
            <div className="w-full lg:w-2/3 bg-white rounded-lg p-4">
              {/* Desktop Table View - Hidden on Mobile */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm lg:text-base">
                  <thead className="bg-white">
                    <tr className="text-left text-gray-600">
                      <th className="p-2 sm:p-4">Product</th>
                      <th className="p-2 sm:p-4">Description</th>
                      <th className="p-2 sm:p-4">Quantity</th>
                      <th className="p-2 sm:p-4">Price</th>
                      <th className="p-2 sm:p-4">Total</th>
                      <th className="p-2 sm:p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems?.map((item) => (
                      <tr
                        key={item.cartId}
                        className="border-t border-gray-200"
                      >
                        <td className="p-2 sm:p-4">
                          <img
                            src={`${API_URL}/uploads/${item?.product?.productImages[0].imageUrl}`}
                            alt={item.product.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded"
                          />
                        </td>
                        <td className="p-2 sm:p-4">
                          <p className="font-semibold">{item.product.name}</p>
                        </td>
                        <td className="p-2 sm:p-4">
                          <div className="flex items-center border border-gray-300 rounded-md w-fit">
                            <button
                              className="px-2 py-1 bg-white"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.cartId,
                                  item.quantity - 1
                                )
                              }
                            >
                              -
                            </button>
                            <span className="px-3 sm:px-4">
                              {item.quantity}
                            </span>
                            <button
                              className="px-2 py-1 bg-white"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.cartId,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-2 sm:p-4 font-medium">
                          ₹{item.product.price.toFixed(2)}
                        </td>
                        <td className="p-2 sm:p-4 font-medium">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-2 sm:p-4">
                          <button
                            onClick={() => handleRemoveItem(item.cartId)}
                            className="text-black hover:text-black"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Visible only on Mobile */}
              <div className="sm:hidden">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="rounded-lg p-4 mb-4">
                    <div className="flex items-start mb-3">
                      <img
                        src={`${API_URL}/uploads/${item?.product?.productImages[0].imageUrl}`}
                        alt={item.product.name}
                        className="w-20 h-20 rounded mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-semibold">{item.product.name}</p>
                          <button
                            onClick={() => handleRemoveItem(item.cartId)}
                            className="text-black hover:text-black"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        {/* <p className="text-gray-500 text-xs">
                          Size: {item.product.size}
                        </p> */}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          className="px-2 py-1 bg-white"
                          onClick={() =>
                            handleUpdateQuantity(item.cartId, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          className="px-2 py-1 bg-white"
                          onClick={() =>
                            handleUpdateQuantity(item.cartId, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Price: ₹{item.product.price.toFixed(2)}
                        </p>
                        <p className="font-medium">
                          Total: ₹
                          {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/Allproduct">
                <button className="mt-6 px-4 py-2 border border-gray-400 w-full sm:w-auto cursor-pointer">
                  ← Continue Shopping
                </button>
              </Link>
            </div>

            {/* Order Summary Section */}
            <div className="w-full lg:w-1/3 bg-white border border-gray-200 p-4 sm:p-6 ">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2 text-sm lg:text-base">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm lg:text-base">
                <span>Shipping:</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm lg:text-base">
                <span>Tax:</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-base lg:text-lg">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
                <button 
                onClick={handleCheckout}
                className="w-full mt-4 bg-lime-950 text-white py-2 cursor-pointer rounded-lg">
                  Proceed to Checkout
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
