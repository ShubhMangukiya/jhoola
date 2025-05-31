import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';

export default function FeatureCollection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products?isFeatured=true`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const getFirstImage = (product) => {
    return product.image1 || product.image2 || product.image3 || product.image4 || '/placeholder.svg';
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="mb-2 text-gray-800 font-semibold text-2xl md:text-4xl">Featured Collection</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative group bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute inset-0 bg-lime-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]"></div>
              <div className="relative z-[2] p-2">
                <img
                  src={`${BASE_URL}${getFirstImage(product)}`}
                  alt={product.title}
                  className="w-full h-32 sm:h-64 object-cover"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity duration-300">
                  <Link to="/cart">
                    <button className="bg-[#2a2a14] text-white p-2 rounded-full cursor-pointer">
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </Link>
                  <Link to="/wishlist">
                    <button className="bg-[#2a2a14] text-white p-2 rounded-full cursor-pointer">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </Link>
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
  );
}