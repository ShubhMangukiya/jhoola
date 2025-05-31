import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Cartim from "../image/cartim.svg";
import { BASE_URL } from "../config";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        alert("Please log in to view wishlist");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/wishlist`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch wishlist");
        }
        const data = await response.json();
        console.log("Wishlist data from API:", data); // Debug log
        setWishlistItems(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error.message);
        alert(`Error: ${error.message}`);
      }
    };
    fetchWishlist();
  }, [token]);

  const handleRemoveItem = async (productId) => {
    if (!token) {
      alert("Please log in to remove items");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item");
      }
      setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
      alert("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert("Please log in to add to cart");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }
      alert("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const getFirstImage = (item) => {
    const image = item.image1 || item.image2 || item.image3 || item.image4 || item.image || Cartim;
    const fullImageUrl = typeof image === 'string' && image.startsWith('/uploads') ? `${BASE_URL}${image}` : image;
    console.log(`Getting image for ${item.name || 'Unnamed'}: raw=${image}, full=${fullImageUrl}`);
    return fullImageUrl;
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 style={{ fontFamily: "La Mango" }} className="text-xl sm:text-2xl lg:text-3xl mb-2 text-center">Wishlist</h2>
        <p className="text-sm text-gray-500 mb-6 text-center"><Link to="/" className="hover:underline">Home</Link> / Wishlist</p>
        <div className="bg-white rounded-lg p-4">
          <div className="hidden sm:block">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="bg-white">
                <tr className="text-left text-gray-600">
                  <th className="p-2 sm:p-4">Product</th>
                  <th className="p-2 sm:p-4">Description</th>
                  <th className="p-2 sm:p-4">Total</th>
                  <th className="p-2 sm:p-4">Add To Cart</th>
                  <th className="p-2 sm:p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlistItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="p-2 sm:p-4">
                      <img src={getFirstImage(item)} alt={item.name} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded" />
                    </td>
                    <td className="p-2 sm:p-4">
                      <p className="font-semibold">{item.name}</p>
                    </td>
                    <td className="p-2 sm:p-4 font-medium">₹{(item.price || 0).toFixed(2)}</td>
                    <td className="p-2 sm:p-4">
                      <button onClick={() => handleAddToCart(item.productId)} className="bg-lime-950 text-white px-3 py-1 rounded">
                        Add To Cart
                      </button>
                    </td>
                    <td className="p-2 sm:p-4">
                      <button onClick={() => handleRemoveItem(item.productId)} className="text-black">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden">
            {wishlistItems.map((item) => (
              <div key={item.id} className="border-t border-gray-200 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <img src={getFirstImage(item)} alt={item.name} className="w-16 h-16 rounded" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="font-medium">₹{(item.price || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button onClick={() => handleAddToCart(item.productId)} className="bg-lime-950 text-white px-3 py-1 rounded ml-20">
                    Add To Cart
                  </button>
                  <button onClick={() => handleRemoveItem(item.productId)} className="text-black">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link to="/Allproduct">
            <button className="mt-6 px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 w-full sm:w-auto">
              ← Continue Shopping
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;