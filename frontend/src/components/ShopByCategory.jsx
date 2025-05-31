import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';

const   ShopByCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white container mx-auto px-4 mt-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group rounded-4xl overflow-hidden shadow-md transition-transform duration-300"
            >
              <img
                src={category.image ? `${BASE_URL}${category.image}` : '/placeholder.svg'}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#262B0D] bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <Link to={`/products?category=${category.id}`} className="mt-4 inline-block text-sm font-medium underline">
                  View Products →
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