import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cartim from "../image/Cartim.svg";
import axios from "axios";
import { API_URL, userToken } from "./Variable";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const userData = userToken();
  const userId = userData?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData?.token) return;
      try {
        const response = await axios.get(
          `${API_URL}/wishlist/getwishlist/${userId}`,
          {
            headers: { Authorization: `Bearer ${userData?.token}` },
          }
        );
        setWishlistItems(response.data.products);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`${API_URL}/wishlist/delete`, {
        data: {
          userId: userId,
          productId: productId,
        },
      });

      toast.success("Removed From Wishlist");

      // Remove from local state
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/addtocart`,
        {
          userId: userId,
          productId: productId,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${userData?.token}` },
        }
      );

      toast.success("Added to Cart");
      console.log("Add to cart response:", response.data);

      // Optional: Remove from wishlist after adding to cart
      // await handleRemoveItem(productId);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  if (!userId || !userData?.token) {
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
                Access Your Wishlist
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                <Link to="/" className="hover:underline text-lime-700">
                  Home
                </Link>{" "}
                / Wishlist
              </p>
            </div>

            {/* Message */}
            <p className="text-base sm:text-lg text-gray-700 max-w-md mx-auto">
              Please log in to view and manage your wishlist items.
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

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center py-16 space-y-6">
          {/* Title + Breadcrumb */}
          <div>
            <h2
              style={{ fontFamily: "La Mango" }}
              className="text-3xl md:text-4xl font-semibold text-lime-950"
            >
              Your Wishlist is Empty
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              <Link to="/" className="hover:underline text-lime-700">
                Home
              </Link>{" "}
              / Wishlist
            </p>
          </div>

          {/* Message */}
          <p className="text-base sm:text-lg text-gray-700 max-w-md mx-auto">
            Looks like you haven’t added anything to your wishlist yet. Start
            exploring now!
          </p>

          {/* CTA */}
          <Link to="/Allproduct">
            <button className="px-6 py-3 bg-lime-950 text-white rounded-lg shadow hover:bg-[#2c3118] hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <h2
            style={{ fontFamily: "La Mango" }}
            className="text-xl sm:text-2xl lg:text-3xl  mb-2 text-center"
          >
            Wishlist
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            / Wishlist
          </p>

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
                    <tr
                      key={item.wishlistId}
                      className="border-t border-gray-200"
                    >
                      <td className="p-2 sm:p-4">
                        <img
                          src={`${API_URL}/uploads/${item?.productImages[0].imageUrl}`}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded"
                        />
                      </td>
                      <td className="p-2 sm:p-4">
                        <p className="font-semibold">{item.name}</p>
                      </td>
                      <td className="p-2 sm:p-4 font-medium">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="p-2 sm:p-4">
                        <button
                          onClick={() => handleAddToCart(item.productId)}
                          className="bg-lime-950 text-white px-3 py-1 rounded"
                        >
                          Add To Cart
                        </button>
                      </td>
                      <td className="p-2 sm:p-4">
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-black"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
              {wishlistItems.map((item) => (
                <div
                  key={item.wishlistId}
                  className="border-t border-gray-200 p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-4">
                    {console.log(
                      `${API_URL}/uploads/${item?.productImages[0].imageUrl}`
                    )}
                    <img
                      src={`${API_URL}/uploads/${item?.productImages[0].imageUrl}`}
                      alt={item.name}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="font-medium">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleAddToCart(item.productId)}
                      className="bg-lime-950 text-white px-3 py-1 rounded  ml-20"
                    >
                      Add To Cart
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-black"
                    >
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
      </div>
    </>
  );
};

export default WishlistPage;
