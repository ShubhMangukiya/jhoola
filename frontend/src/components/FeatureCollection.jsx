import { useEffect, useState } from "react";
import { Heart, ShoppingCart, MoveUpRight } from "lucide-react";
import background from "../image/background.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, userToken } from "./Variable";
import { toast } from "react-hot-toast";

export default function FeatureCollection() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const userData = userToken();
  const IMAGE_BASE_URL = `${API_URL}/uploads/`;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => {
        const limitedProducts = res.data.slice(0, 4); // Only 4 products
        setFeaturedProducts(limitedProducts);
      })
      .catch((err) => console.error("Error fetching featured products:", err));
  }, []);

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
      <div className="bg-white p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* <div className="relative flex items-center justify-center mb-5">
            <img src={background || "/placeholder.svg"} alt="back" />
            <div className="absolute bottom-4 right-4 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4">
                <button className="p-2 shadow-lg">
                  <MoveUpRight className="bg-white h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 p-1.5 sm:p-2 md:p-3 rounded-full cursor-pointer" />
                </button>
            </div>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center">
            <div className="mb-2 md:mt-24">
              <h2
                style={{ fontFamily: "La-Mango" }}
                className="mb-2 text-gray-800 font-semibold text-2xl md:text-4xl lg:text-2xl"
              >
                Featured Collection
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts?.map((product) => (
              <div
                key={product.productId}
                className="relative group bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute inset-0 bg-lime-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]"></div>

                <div className="relative z-[2] p-2">
                  <Link to={`/Singleproduct/${product.productId}`}>
                    <img
                      src={
                        product.productImages?.[0]
                          ? IMAGE_BASE_URL + product.productImages[0].imageUrl
                          : "/placeholder.svg"
                      }
                      alt={product.name}
                      className="w-full h-32 sm:h-64 object-cover"
                    />
                  </Link>

                  <div className="absolute top-3 right-3 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity duration-300">
                    <Link to="/Cart">
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

                <div className="p-3 sm:p-4 z-[3] relative">
                  <h3 className="font-medium text-sm sm:text-lg group-hover:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-2 sm:mb-3 group-hover:text-white line-clamp-1 sm:line-clamp-2">
                    {product.shortDesc}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base group-hover:text-white">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="text-gray-500 line-through text-xs sm:text-sm group-hover:text-white">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
