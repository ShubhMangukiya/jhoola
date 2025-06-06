import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, userToken } from "./Variable";
import toast from "react-hot-toast";

export default function Shopby() {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("All Categories");
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const userData = userToken();
  const navigate = useNavigate();
    const IMAGE_BASE_URL = `${API_URL}/uploads/`;


  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const [categoriesRes, productsRes] = await Promise.all([
  //         axios.get(`${API_URL}/api/categories`),
  //         axios.get(`${API_URL}/api/products`),
  //       ]);
  //       setCategories(categoriesRes.data);
  //       setAllProducts(productsRes.data);

  //       // Default to first category or null if empty
  //       if (categoriesRes.data.length > 0) {
  //         setSelectedCategoryId(categoriesRes.data[0].id);
  //       } else {
  //         setSelectedCategoryId(null);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // Filter products based on selected category, if any
 
  useEffect(() => {
  async function fetchData() {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/api/categories`),
        axios.get(`${API_URL}/api/products`),
      ]);
      setCategories(categoriesRes.data);
      setAllProducts(productsRes.data);
      // Set "All Categories" as default
      setSelectedCategoryId(null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  fetchData();
}, []);
  
  const filteredProducts = selectedCategoryId
    ? allProducts.filter(
        (product) => String(product.categoryId) === String(selectedCategoryId)
      )
    : allProducts;

  // Sort filtered products by price
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price - b.price;
    if (sortOrder === "highToLow") return b.price - a.price;
    return 0;
  });

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
      <div className="bg-white min-h-screen p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <h1
          style={{ fontFamily: "La Mango" }}
          className="text-center text-3xl font-serif mb-4"
        >
          Shop by Categories
        </h1>

        <div className="flex justify-center text-xs sm:text-sm mb-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span>Shop by categories</span>
        </div>

        {/* Category buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {/* "All Categories" button */}
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-5 py-2 rounded-md border font-semibold transition-colors ${
              selectedCategoryId === null
                ? "bg-lime-950 text-white border-lime-950"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            }`}
          >
            All Categories
          </button>

          {categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => setSelectedCategoryId(category.categoryId)}
              className={`px-5 py-2 rounded-md border font-semibold transition-colors ${
                selectedCategoryId === category.categoryId
                  ? "bg-lime-950 text-white border-lime-950"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}

          {/* Sort toggle */}
          <button
            onClick={() =>
              setSortOrder(
                sortOrder === "lowToHigh" ? "highToLow" : "lowToHigh"
              )
            }
            className="ml-auto px-4 py-2 rounded-md border bg-white text-black flex items-center gap-1 font-semibold hover:bg-gray-100 transition"
          >
            Sort By: {sortOrder === "lowToHigh" ? "Low to High" : "High to Low"}
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No products found in this category.
            </p>
          ) : (
            sortedProducts.map((product) => (
              <div
                key={product.productId}
                className="relative group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:bg-[#262B0D] cursor-pointer transition-colors duration-300"
              >
                <div className="relative z-10 p-2">
                  <Link to={`/Singleproduct/${product.productId}`}>
                    <img
                      src={product.productImages?.[0]
                          ? IMAGE_BASE_URL + product.productImages[0].imageUrl
                          : "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </Link>
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => addToCart(product.productId)}
                      className="bg-[#2a2a14] text-white p-2 rounded-full"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => addToWishlist(product.productId)}
                      className="bg-[#2a2a14] text-white p-2 rounded-full"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate group-hover:text-white transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 group-hover:text-white transition-colors duration-300">
                    {product.shortDesc}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-base group-hover:text-white transition-colors duration-300">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="line-through text-sm text-gray-500 group-hover:text-white transition-colors duration-300">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
