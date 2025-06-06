import React, { useEffect, useState } from "react";
import product from "../image/product.png"; // Replace with your image path
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Variable";

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  return (
    <div className="bg-white container mx-auto px-4 mt-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2
          style={{ fontFamily: "La Mango" }}
          className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6"
        >
          Shop by Category
        </h2>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
          {/* Image Cards */}
          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="relative group rounded-4xl overflow-hidden shadow-md  transition-transform duration-300"
            >
              {/* Image */}
              {category.imageUrl && (
                <img
                  src={`${API_URL}/uploads/${category.imageUrl}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#262B0D] bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="text-sm mt-2 text-center">
                  "Introducing our latest innovation – a perfect blend of
                  technology and design."
                </p>
                <Link
                  to="/Shopby"
                  className="mt-4 inline-block text-sm font-medium underline"
                >
                  View Product →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
