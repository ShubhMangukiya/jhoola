import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';
import Navbar from './Navbar';
import Footer from './Footer';

export default function NewProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products?sort=createdAt`);
        const data = await response.json();
        setProducts(data.slice(0, 9)); // Limit to 9 latest products
      } catch (error) {
        console.error('Error fetching new products:', error);
      }
    };
    fetchNewProducts();
  }, []);

  const getFirstImage = (product) => {
    return product.image1 || product.image2 || product.image3 || product.image4 || '/placeholder.svg';
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white px-4 py-8 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-3xl font-serif mb-2">New Products</h1>
          <div className="flex justify-center text-sm mb-12">
            <Link to="/" className="text-gray-600 hover:underline">
              Home
            </Link>
            <span className="mx-1 text-gray-600">/</span>
            <span className="text-gray-800">New Products</span>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative rounded-4xl overflow-hidden shadow-lg group h-80"
              >
                <img
                  src={`${BASE_URL}${getFirstImage(product)}`}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-6 bg-gradient-to-b from-transparent to-black opacity-80">
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white">
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-sm">{product.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}