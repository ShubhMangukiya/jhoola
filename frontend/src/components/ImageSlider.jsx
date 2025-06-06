import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MoveUpRight } from "lucide-react";
import background from "../image/background.png"

const images = [
  {
    id: 1,
    src: background, // your uploaded image
    alt: "Cozy porch with swing",
    link: "/Singleproduct",
  },
  {
    id: 2,
    src: background, // your uploaded image
    alt: "Cozy porch with swing",
    link: "/Singleproduct",
  },
  {
    id: 3,
    src: background, // your uploaded image
    alt: "Cozy porch with swing",
    link: "/Singleproduct",
  },
  {
    id: 4,
    src: background, // your uploaded image
    alt: "Cozy porch with swing",
    link: "/Singleproduct",
  },
  // Add more images as needed
];

const AutoSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // Slide every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="relative flex items-center justify-center mb-5 rounded-xl overflow-hidden shadow-lg">
        <img
          src={images[current].src}
          alt={images[current].alt}
          className="w-full h-auto object-cover"
        />

        {/* MoveUpRight Button */}
        <div className="absolute bottom-4 right-4 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4">
          <Link to={images[current].link}>
            <button className="p-2 shadow-lg">
              <MoveUpRight className="bg-white h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 p-1.5 sm:p-2 md:p-3 rounded-full cursor-pointer" />
            </button>
          </Link>
        </div>

        {/* Dots Navigation (Optional) */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === current ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoSlider;
