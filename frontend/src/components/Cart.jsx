import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Cartim from "../image/cartim.svg";
import { BASE_URL } from "../config";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      if (!token || token === "null" || token === "") {
        alert("Please log in to view cart");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/cart`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch cart: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log("Cart data from API:", data); // Debug log
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error.message);
        setCartItems([]); // Fallback to empty array
        alert(`Error: ${error.message}. Contact backend team to fix /api/cart.`);
      }
    };
    fetchCart();
  }, [token]);

  const handleQuantityChange = (id, amount) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const handleRemoveItem = async (productId) => {
    if (!token || token === "null" || token === "") {
      alert("Please log in to remove items");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove item: ${response.status} - ${errorText}`);
      }
      setCartItems(cartItems.filter(item => item.productId !== productId));
      alert("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + (price * item.quantity || 0);
  }, 0);
  const shipping = 20;
  const tax = 20;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <h2 style={{ fontFamily: "La Mango" }} className="text-xl sm:text-2xl lg:text-3xl text-lime-950 mb-2 text-center">Cart Page</h2>
          <p className="text-sm text-lime-950 mb-6 text-center"><Link to="/" className="hover:underline">Home</Link> / Cart Page</p>
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            <div className="w-full lg:w-2/3 bg-white rounded-lg p-4">
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
                    {cartItems.map(item => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="p-2 sm:p-4">
                          <img src={item.product?.image1 || item.image || Cartim} alt={item.product?.title || item.name} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded" />
                        </td>
                        <td className="p-2 sm:p-4">
                          <p className="font-semibold">{item.product?.title || item.name || 'N/A'}</p>
                        </td>
                        <td className="p-2 sm:p-4">
                          <div className="flex items-center border border-gray-300 rounded-md w-fit">
                            <button className="px-2 py-1 bg-white" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                            <span className="px-3 sm:px-4">{item.quantity}</span>
                            <button className="px-2 py-1 bg-white" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                          </div>
                        </td>
                        <td className="p-2 sm:p-4 font-medium">₹{(item.product?.price || 0).toFixed(2)}</td>
                        <td className="p-2 sm:p-4 font-medium">₹{(item.product?.price * item.quantity || 0).toFixed(2)}</td>
                        <td className="p-2 sm:p-4">
                          <button onClick={() => handleRemoveItem(item.productId)} className="text-black hover:text-black"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sm:hidden">
                {cartItems.map(item => (
                  <div key={item.id} className="rounded-lg p-4 mb-4">
                    <div className="flex items-start mb-3">
                      <img src={item.product?.image1 || item.image || Cartim} alt={item.product?.title || item.name} className="w-20 h-20 rounded mr-3" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-semibold">{item.product?.title || item.name || 'N/A'}</p>
                          <button onClick={() => handleRemoveItem(item.productId)} className="text-black hover:text-black"><FaTrash /></button>
                        </div>
                        <p className="text-gray-500 text-xs">Size: {item.size || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button className="px-2 py-1 bg-white" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        <span className="px-3">{item.quantity}</span>
                        <button className="px-2 py-1 bg-white" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price: ₹{(item.product?.price || 0).toFixed(2)}</p>
                        <p className="font-medium">Total: ₹{(item.product?.price * item.quantity || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/Allproduct"><button className="mt-6 px-4 py-2 border border-gray-400 w-full sm:w-auto cursor-pointer">← Continue Shopping</button></Link>
            </div>
            <div className="w-full lg:w-1/3 bg-white border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2 text-sm lg:text-base"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between mb-2 text-sm lg:text-base"><span>Shipping:</span><span>₹{shipping.toFixed(2)}</span></div>
              <div className="flex justify-between mb-2 text-sm lg:text-base"><span>Tax:</span><span>₹{tax.toFixed(2)}</span></div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-base lg:text-lg"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
              <Link to={`/checkout?cartItems=${encodeURIComponent(JSON.stringify(cartItems))}&total=${total}`}>
                <button className="w-full mt-4 bg-lime-950 text-white py-2 cursor-pointer rounded-lg">Proceed to Checkout</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;