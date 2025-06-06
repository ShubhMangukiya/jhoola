import { useEffect, useState } from "react";
import axios from "axios"; // Don't forget to import axios!
import { Filter, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { RiFilterOffFill } from "react-icons/ri";
import { API_URL, userToken } from "./Variable";
import toast from "react-hot-toast";

export default function ProductListing() {
  const [products, setProducts] = useState([]); // Move products state here
  const [minPrice, setMinPrice] = useState("0.00");
  const [maxPrice, setMaxPrice] = useState("1200000");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("highToLow");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isPriceFilterApplied, setIsPriceFilterApplied] = useState(false);
  const navigate = useNavigate();
  const userData = userToken();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  const IMAGE_BASE_URL = `${API_URL}/uploads/`;

  // Fetch products once on mount
  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const [appliedMinPrice, setAppliedMinPrice] = useState("0.00");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("12000.00");

  // Filter products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "highToLow") return b.price - a.price;
    if (sortOrder === "lowToHigh") return a.price - b.price;
    return 0;
  });

  const filteredProducts = sortedProducts.filter((product) => {
    const categoryIdStr = String(product.categoryId);

    const isCategoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(categoryIdStr);

    const isPriceMatch =
      !isPriceFilterApplied ||
      (product.price >= parseFloat(appliedMinPrice) &&
        product.price <= parseFloat(appliedMaxPrice));

    return isCategoryMatch && isPriceMatch;
  });

  const handleCategoryChange = (categoryId) => {
    const id = String(categoryId);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const addToCart = async (productId) => {
    if (!userData?.token) {
      toast.error("Please Login To Add Products To Cart");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    try {
      await axios.post(
        `${API_URL}/cart/addtocart`,
        {
          userId: userData?.userId,
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      toast.success("Item Added To Cart");
    } catch (error) {
      console.log(error);
      toast.error("Error Adding to Cart");
    }
  };

  const addToWishlist = async (productId) => {
    if (!userData?.token) {
      toast.error("Please Login To Add Products To Cart");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    try {
      await axios.post(
        `${API_URL}/wishlist/addtowishlist`,
        {
          userId: userData?.userId,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      toast.success("Item Added To Wishlist");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
    }
  };

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white pb-40">
          <div className="py-8 text-center">
            <h1 className="text-3xl font-serif">All Product</h1>
            <div className="text-sm text-gray-600 mt-1">
              <Link to="/" className="hover:underline">
                Home
              </Link>{" "}
              / All Product
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              className={`flex items-center gap-2 ${
                showFilters
                  ? "bg-[#2c3a1a] text-white"
                  : "bg-white text-black border border-gray-300"
              } px-4 py-2 rounded-md transition-colors duration-200`}
              onClick={toggleFilters}
            >
              {showFilters ? (
                <RiFilterOffFill size={18} />
              ) : (
                <Filter size={18} />
              )}
              <span>Filter</span>
            </button>

            <div className="relative inline-block">
              <button
                className="border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center gap-1"
                onClick={() =>
                  setSortOrder(
                    sortOrder === "highToLow" ? "lowToHigh" : "highToLow"
                  )
                }
              >
                <span>
                  Sort By:{" "}
                  {sortOrder === "highToLow" ? "High to Low" : "Low to High"}
                </span>
                <ChevronRight size={16} className="transform rotate-[90deg]" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {showFilters && (
              <div className="md:w-64 flex-shrink-0">
                {/* Filters Sidebar */}
                <div className="border border-gray-200 rounded-md p-4 mb-4 bg-white">
                  <h3
                    className="text-xl mb-3"
                    style={{ fontFamily: "La Mango" }}
                  >
                    Shop by Category
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const stringId = String(category.id); // Normalize
                      return (
                        <div key={stringId} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`} // id has prefix 'category-'
                            value={String(category.id)}
                            checked={selectedCategories.includes(
                              String(category.categoryId)
                            )}
                            onChange={() =>
                              handleCategoryChange(String(category.categoryId))
                            }
                            className="h-4 w-4 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`category-${stringId}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {category.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <h3
                    style={{ fontFamily: "La Mango" }}
                    className=" text-xl mb-3 mt-10"
                  >
                    Shop by Price
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <div className="w-1/2">
                      <label
                        htmlFor="min-price"
                        className="block text-xs text-gray-500 mb-1"
                      >
                        Min Price
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="text"
                          id="min-price"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="pl-6 w-full border border-gray-300 rounded-md py-1 text-sm"
                        />
                      </div>
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="max-price"
                        className="block text-xs text-gray-500 mb-1"
                      >
                        Max Price
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="text"
                          id="max-price"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="pl-6 w-full border border-gray-300 rounded-md py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedMinPrice(minPrice);
                      setAppliedMaxPrice(maxPrice);
                      setIsPriceFilterApplied(true); // enable price filter
                    }}
                    className="w-full bg-[#2c3a1a] text-white py-2 rounded-md text-sm cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            )}

            {/* <Link to={`/Singleproduct/${product.productId}`}> */}
            <div className="flex-1">
              {/* Product grid */}
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 ${
                  showFilters ? "lg:grid-cols-3" : "lg:grid-cols-4"
                } gap-3 sm:gap-6`}
              >
                {filteredProducts?.map((product) => (
                  <div
                    key={product.productId}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white hover:bg-[#262B0D] hover:shadow-md transition-shadow"
                  >
                    <div className="relative z-[2] p-2">
                      <Link to={`/Singleproduct/${product.productId}`}>
                        <img
                          src={
                            product.productImages?.[0]
                              ? IMAGE_BASE_URL +
                                product.productImages[0].imageUrl
                              : "/placeholder.svg"
                          }
                          alt={product.name}
                          className="w-full object-cover"
                        />
                      </Link>

                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link to="">
                          <button
                            onClick={() => addToCart(product.productId)}
                            className="bg-[#2a2a14] text-white p-2 rounded-full cursor-pointer"
                          >
                            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </Link>
                        <Link to="">
                          <button
                            onClick={() => addToWishlist(product.productId)}
                            className="bg-[#2a2a14] text-white p-2 rounded-full cursor-pointer"
                          >
                            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </Link>
                      </div>
                    </div>

                    <div className="p-4 z-[3] relative">
                      <h3 className="font-medium text-lg group-hover:text-white">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 group-hover:text-white">
                        {product.shortDesc}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="font-medium text-base sm:text-lg group-hover:text-white">
                          ₹{product.price.toFixed(2)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 line-through group-hover:text-white">
                          ₹{product.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <p className="text-center font-medium">
                  No products match your filters.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
