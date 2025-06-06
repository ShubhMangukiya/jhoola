import { useState, useEffect, useRef } from "react";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  PlayCircle,
  PauseCircle,
} from "lucide-react";

const IMAGE_BASE_URL = `${API_URL}/uploads/`;
import Video from "../image/zulavideo.mp4"
import { API_URL } from "./Variable";

export default function TopSellingProduct() {
  const [products, setProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched products:", data); // <-- Debug here
        setProducts(data.slice(0, 3));
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  useEffect(() => {
    if (!showVideo && !isPaused && products.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showVideo, isPaused, products]);

  const handlePrev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
    if (!isPaused && !showVideo) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }
  };

  const handleNext = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
    if (!isPaused && !showVideo) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading products...
      </div>
    );
  }

  const currentProduct = products[currentImageIndex];

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto items-center">
        <div className="relative rounded-4xl overflow-hidden shadow-md mx-auto w-full max-w-md lg:max-w-full">
          {showVideo ? (
            <div className="aspect-video w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
              <video
                src={Video}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <>
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                {products.map((product, index) => {
                  const imageSrc = `${IMAGE_BASE_URL}${product.productImages[0].imageUrl}`;
                  return (
                    <img
                      key={product.id}
                      src={imageSrc}
                      alt={product.name}
                      width={600}
                      height={700}
                      className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                      onError={(e) => {
                        console.error(`Failed to load image: ${imageSrc}`);
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  );
                })}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="bg-white text-black p-3 sm:p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
                  onClick={() => setShowVideo(true)}
                  aria-label="Play Video"
                >
                  <PlayCircle className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="bg-white flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-serif text-gray-800">
              Top Selling Product
            </h2>

            <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
              <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
                {products?.map((product, index) => {
                  const imageSrc = `${IMAGE_BASE_URL}${product.productImages[0].imageUrl}`;
                  return (
                    <img
                      key={product.productd}
                      src={imageSrc}
                      alt={product.name}
                      width={400}
                      height={300}
                      className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  );
                })}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-white w-4"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 transform -translate-y-1/2">
                <button
                  onClick={handlePrev}
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition duration-300 shadow-md"
                  aria-label="Previous image"
                >
                  <ArrowLeftCircle className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                </button>

                <button
                  onClick={togglePause}
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition duration-300 shadow-md"
                  aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                >
                  {isPaused ? (
                    <PlayCircle className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                  ) : (
                    <PauseCircle className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition duration-300 shadow-md"
                  aria-label="Next image"
                >
                  <ArrowRightCircle className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              {currentProduct.name}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed px-2 sm:px-8">
              {currentProduct.description}
            </p>

            <div className="flex justify-center items-center space-x-4">
              <span className="text-lg sm:text-xl font-bold text-gray-800">
                ₹{currentProduct.price}
              </span>
              {currentProduct.originalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{currentProduct.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
