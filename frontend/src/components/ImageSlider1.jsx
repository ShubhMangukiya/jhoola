import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MoveUpRight } from "lucide-react";
import { API_URL } from "./Variable";

export default function ImageSlider() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/slider`);
        const data = res.data;
        const slideArray = [];

        for (let i = 1; i <= 5; i++) {
          if (data[`image${i}`]) {
            slideArray.push({
              image: `${API_URL}${data[`image${i}`]}`,
              link: data[`slider${i}Link`] || "#",
            });
          }
        }

        setSlides(slideArray);
      } catch (err) {
        console.error("Failed to fetch slider data:", err);
      }
    };

    fetchSlides();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <div className="pl-[5%] pr-[5%] bg-white">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative rounded-2xl overflow-hidden">
            <img
              src={slide.image}
              alt={`slide-${index}`}
              className="w-full h-[400px] md:h-[600px] object-cover rounded-4xl"
            />
            <div className="absolute inset-0 flex items-end mb-5 justify-end mr-5">
              <a
                href={slide.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border border-white text-white font-semibold p-3 rounded-full hover:bg-white/20 transition"
              >
                <MoveUpRight />
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
