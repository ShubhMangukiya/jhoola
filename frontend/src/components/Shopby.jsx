"use client";

import { ChevronRight, Heart, ShoppingCart, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { BASE_URL } from "../config";
import { RiFilterOffFill } from "react-icons/ri";

export default function Shopby() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/api/products`;
      console.log("Fetching products with URL:", url);
      const response = await fetch(url, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend response error:", { status: response.status, text: errorText });
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log("Raw product data from API with Category:", data);

      if (!Array.isArray(data)) {
        throw new Error("API did not return an array of products");
      }

      const filteredData = data.filter((product) => {
        const productCategory = product.Category ? product.Category.name.trim().toLowerCase() : "";
        const selectedCat = selectedCategory.trim().toLowerCase();
        const matchesCategory = selectedCategory === "All" || productCategory === selectedCat;
        console.log(`Checking product ${product.title || 'Unnamed'}: category=${productCategory}, selected=${selectedCat}, matches=${matchesCategory}`);
        return matchesCategory;
      });

      const sortedData = filteredData.sort((a, b) => {
        const priceA = Number.parseFloat(a.price) || 0;
        const priceB = Number.parseFloat(b.price) || 0;
        return sortOrder === "lowToHigh" ? priceA - priceB : priceB - priceA;
      });

      setProducts(sortedData);
      console.log("Filtered and sorted products:", sortedData);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/categories`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log("Raw category data from API:", data);
      if (!Array.isArray(data)) {
        throw new Error("API did not return an array of categories");
      }
      const uniqueCategories = ["All", ...new Set(data.map(cat => cat.name).filter(name => name && name.trim()))];
      setCategories(uniqueCategories);
      console.log("Unique mapped categories:", uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFirstImage = (product) => {
    const image = product.image1 || product.image2 || product.image3 || product.image4;
    const fullImageUrl = image ? `${BASE_URL}${image}` : null;
    console.log(`Getting image for ${product.title}: raw=${image}, full=${fullImageUrl || 'No image found'}`);
    return fullImageUrl || `${BASE_URL}/placeholder.svg`;
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert("Please log in to add to cart");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      alert("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!token) {
      alert("Please log in to add to wishlist");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/wishlist`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error("Failed to add to wishlist");
      alert("Added to wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1
            style={{ fontFamily: "La Mango" }}
            className="text-center text-2xl sm:text-3xl font-serif mb-3 sm:mb-4"
          >
            Shop by Categories
          </h1>

          <div className="flex justify-center text-xs sm:text-sm mb-4 sm:mb-8">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-1">/</span>
            <span>Shop by categories</span>
          </div>

          {/* Category Buttons */}
          <div className="overflow-x-auto hide-scrollbar sm:overflow-visible sm:flex sm:flex-wrap sm:justify-center mb-4 sm:mb-6">
            <div className="flex space-x-2 min-w-max pb-2 sm:pb-0 sm:flex-wrap sm:gap-2 sm:space-x-0 sm:w-full">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md border whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-lime-950 text-white"
                      : "bg-white text-black border-lime-950"
                  } ${index > 0 ? "sm:ml-2" : ""}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filter and Sort Buttons */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <button
              className="hidden sm:flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
            <button
              className="border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center gap-1"
              onClick={() => {
                setSortOrder(sortOrder === "lowToHigh" ? "highToLow" : "lowToHigh");
                fetchProducts();
              }}
            >
              <span>Sort By: {sortOrder === "lowToHigh" ? "High to Low" : "Low to High"}</span>
              <ChevronRight size={16} className="transform rotate-[90deg]" />
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {loading ? (
              <p className="text-center font-medium">Loading products...</p>
            ) : error ? (
              <p className="text-center font-medium text-red-500">Error: {error}</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <Link
                  to={`/singleproduct/${product.id}`}
                  key={product.id}
                  className="relative group bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative z-[2] p-2">
                    <img
                      src={getFirstImage(product)}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="w-full h-32 sm:h-64 object-cover"
                      onError={(e) => {
                        e.target.src = `${BASE_URL}/placeholder.svg`;
                        console.log(`Image failed for ${product.title}, falling back to ${BASE_URL}/placeholder.svg`);
                      }}
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product.id);
                        }}
                        className="bg-[#2a2a14] text-white p-2 rounded-full"
                      >
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToWishlist(product.id);
                        }}
                        className="bg-[#2a2a14] text-white p-2 rounded-full"
                      >
                        <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 z-[3] relative">
                    <h3 className="font-medium text-sm sm:text-lg group-hover:text-white truncate">
                      {product.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-2 sm:mb-3 group-hover:text-white line-clamp-1 sm:line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base group-hover:text-white">
                        ₹{(product.price || 0).toFixed(2)}
                      </span>
                      <span className="text-gray-500 line-through text-xs sm:text-sm group-hover:text-white">
                        ₹{(product.originalPrice || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center font-medium">No products match your filters.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}