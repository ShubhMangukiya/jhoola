import React, { useState, useEffect } from "react";
import { Filter, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BASE_URL } from "../config";
import { RiFilterOffFill } from "react-icons/ri";

export default function ProductListing() {
  const [minPrice, setMinPrice] = useState("0.00");
  const [maxPrice, setMaxPrice] = useState("20000.00");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("highToLow");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategories, minPrice, maxPrice, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/api/products`;
      if (selectedCategories.length > 0) {
        url += `?category=${selectedCategories.map(cat => cat.toString()).join(',')}`;
      }
      console.log("Fetching products with URL:", url);
      const response = await fetch(url, {
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
      console.log("Raw data from API:", data);

      if (!Array.isArray(data)) {
        throw new Error("API did not return an array of products");
      }

      let filteredData = [...data]; // Start with all products
      // Apply price filter only if minPrice or maxPrice is changed from default
      const defaultMin = "0.00";
      const defaultMax = "20000.00";
      if (minPrice !== defaultMin || maxPrice !== defaultMax) {
        filteredData = filteredData.filter((product) => {
          const price = Number.parseFloat(product.price) || 0;
          const withinPriceRange = price >= Number.parseFloat(minPrice) && price <= Number.parseFloat(maxPrice);
          console.log(`Checking product ${product.title || 'Unnamed'}: price=${price}, min=${minPrice}, max=${maxPrice}, withinRange=${withinRange}`);
          return withinPriceRange;
        });
      } else {
        console.log("Using default price range, no price filtering applied");
      }

      const sortedData = filteredData.sort((a, b) => {
        const priceA = Number.parseFloat(a.price) || 0;
        const priceB = Number.parseFloat(b.price) || 0;
        return sortOrder === "highToLow" ? priceB - priceA : priceA - priceB;
      });

      setProducts(sortedData);
      console.log("Filtered and sorted products:", sortedData.length, sortedData);
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
      console.log("Categories from API:", data);
      if (!Array.isArray(data)) {
        throw new Error("API did not return an array of categories");
      }
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    // Triggered via useEffect
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const getFirstImage = (product) => {
    const image = product.image1 || product.image2 || product.image3 || product.image4;
    const fullImageUrl = image ? `${BASE_URL}${image}` : `${BASE_URL}/placeholder.svg`;
    console.log(`Getting image for ${product.title}: raw=${image}, full=${fullImageUrl}`);
    return fullImageUrl;
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
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white pb-40">
          <div className="py-8 text-center">
            <h1 className="text-3xl font-serif">All Product</h1>
            <div className="text-sm text-gray-600 mt-1">
              <Link to="/" className="hover:underline">Home</Link> / All Product
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <button
              className={`flex items-center gap-2 ${showFilters ? 'bg-[#2c3a1a] text-white' : 'bg-white text-black border border-gray-300'} px-4 py-2 rounded-md transition-colors duration-200`}
              onClick={toggleFilters}
            >
              {showFilters ? <RiFilterOffFill size={18} /> : <Filter size={18} />}
              <span>Filter</span>
            </button>
            <button
              className="border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center gap-1"
              onClick={() => {
                setSortOrder(sortOrder === "highToLow" ? "lowToHigh" : "highToLow");
                fetchProducts();
              }}
            >
              <span>Sort By: {sortOrder === "highToLow" ? "High to Low" : "Low to High"}</span>
              <ChevronRight size={16} className="transform rotate-[90deg]" />
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {showFilters && (
              <div className="md:w-64 flex-shrink-0">
                <div className="border border-gray-200 rounded-md p-4 mb-4 bg-white">
                  <h3 style={{ fontFamily: "La Mango" }} className="text-xl mb-3">Shop by Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={category.id}
                          checked={selectedCategories.includes(category.id.toString())}
                          onChange={() => handleCategoryChange(category.id.toString())}
                          className="h-4 w-4 border-gray-300 rounded"
                        />
                        <label htmlFor={category.id} className="ml-2 text-sm text-gray-700">
                          {category.name || category.label || "Unnamed Category"}
                        </label>
                      </div>
                    ))}
                  </div>
                  <h3 style={{ fontFamily: "La Mango" }} className="text-xl mb-3 mt-10">Shop by Price</h3>
                  <div className="flex gap-2 mb-3">
                    <div className="w-1/2">
                      <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">Min Price</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">₹</span>
                        <input
                          type="text"
                          id="min-price"
                          value={minPrice}
                          onChange={(e) => {
                            setMinPrice(e.target.value);
                            fetchProducts();
                          }}
                          className="pl-6 w-full border border-gray-300 rounded-md py-1 text-sm"
                        />
                      </div>
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">Max Price</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">₹</span>
                        <input
                          type="text"
                          id="max-price"
                          value={maxPrice}
                          onChange={(e) => {
                            setMaxPrice(e.target.value);
                            fetchProducts();
                          }}
                          className="pl-6 w-full border border-gray-300 rounded-md py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={fetchProducts}
                    className="w-full bg-[#2c3a1a] text-white py-2 rounded-md text-sm cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            )}
            <div className="flex-1">
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-3 sm:gap-6`}
              >
                {loading ? (
                  <p className="text-center font-medium">Loading products...</p>
                ) : error ? (
                  <p className="text-center font-medium text-red-500">Error: {error}</p>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <Link
                      to={`/singleproduct/${product.id}`}
                      key={product.id}
                      className="block"
                    >
                      <div className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                        <div className="absolute inset-0 bg-lime-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]"></div>
                        <div className="relative z-[2] p-2">
                          <img
                            src={getFirstImage(product)}
                            alt={product.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = `${BASE_URL}/placeholder.svg`;
                              console.log(`Image failed for ${product.title}, falling back to placeholder`);
                            }}
                          />
                          <div className="absolute top-3 right-3 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product.id);
                              }}
                              className="bg-[#2a2a14] text-white p-2 rounded-full cursor-pointer"
                            >
                              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToWishlist(product.id);
                              }}
                              className="bg-[#2a2a14] text-white p-2 rounded-full cursor-pointer"
                            >
                              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 z-[3] relative">
                          <h3 className="font-medium text-lg group-hover:text-white">{product.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2 group-hover:text-white">{product.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="font-medium text-base sm:text-lg group-hover:text-white">
                              ₹{(product.price || 0).toFixed(2)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 line-through group-hover:text-white">
                              ₹{(product.originalPrice || 0).toFixed(2)}
                            </span>
                          </div>
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