import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { BASE_URL } from "../config";

export default function TopSellingProduct() {
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProduct(data[0]))
      .catch(() => setProduct(null));
  }, []);

  useEffect(() => {
    if (!showVideo && !paused && product) {
      const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [showVideo, paused, product]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);

  return (
    <div className="bg-white py-10 px-4 flex justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl w-full items-start">
        {/* Left: Video/Image Display */}
        <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-md">
          {showVideo && product.video ? (
            <iframe
              src={`${BASE_URL}${product.video}`}
              title="product-video"
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <img
              src={`${BASE_URL}${images[currentIndex]}`}
              alt="product"
              className="w-full h-full object-cover"
            />
          )}
          {!showVideo && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-20">
              <button onClick={() => setShowVideo(true)}>
                <PlayCircle className="w-16 h-16 text-white hover:scale-110 transition" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Carousel + Details */}
        <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">
            Top Selling Product
          </h2>

          <div className="relative h-48 mb-4 rounded overflow-hidden">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`${BASE_URL}${img}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                  idx === currentIndex ? "opacity-100" : "opacity-0"
                }`}
                alt="product-slide"
              />
            ))}
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-3 -translate-y-1/2">
              <button onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}>
                <ArrowLeftCircle className="w-6 h-6 text-white bg-black bg-opacity-30 rounded-full p-1" />
              </button>
              <button onClick={() => setPaused(!paused)}>
                {paused ? (
                  <PlayCircle className="w-6 h-6 text-white bg-black bg-opacity-30 rounded-full p-1" />
                ) : (
                  <PauseCircle className="w-6 h-6 text-white bg-black bg-opacity-30 rounded-full p-1" />
                )}
              </button>
              <button onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}>
                <ArrowRightCircle className="w-6 h-6 text-white bg-black bg-opacity-30 rounded-full p-1" />
              </button>
            </div>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    idx === currentIndex ? "bg-gray-800" : "bg-gray-400"
                  }`}
                ></span>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-sm line-through text-gray-500">
              ₹{(product.originalPrice || product.price + 2000).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
