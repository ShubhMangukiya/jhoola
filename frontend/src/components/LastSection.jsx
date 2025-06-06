import React, { useEffect, useState } from "react";
import { IoLogoInstagram } from "react-icons/io5";
import Background from "./Background";
import { API_URL } from "./Variable";

const LastSection = () => {
  const [reels, setReels] = useState([
    { image: null, link: "#", alt: "" },
    { image: null, link: "#", alt: "" },
    { image: null, link: "#", alt: "" },
    { image: null, link: "#", alt: "" },
    { image: null, link: "#", alt: "" },
  ]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch(`${API_URL}/api/instagram`);
        const data = await res.json();

        if (data) {
          const reelsArr = [];
          for (let i = 1; i <= 5; i++) {
            reelsArr.push({
              image: data[`reel${i}Image`],
              link: data[`reel${i}Link`] || "#",
              alt: data[`reel${i}Alt`] || `Instagram Reel ${i}`,
            });
          }
          setReels(reelsArr);
        }
      } catch (error) {
        console.error("Failed to fetch reels:", error);
      }
    };

    fetchReels();
  }, []);

  return (
    <>
      <Background />
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto">
          {/* Instagram Section */}
          <div className="flex items-center justify-center p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl items-center">
              {/* Left Section */}
              <div className="flex flex-col items-center">
                {/* Instagram Image */}
                <div className="relative w-64 h-64 rounded-4xl overflow-hidden shadow-lg group">
                  {reels[0].image ? (
                    <a
                      href={reels[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${API_URL}${reels[0].image}`}
                        alt={reels[0].alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-3xl font-bold">
                          <IoLogoInstagram />
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                {/* Instagram Username */}
                <p
                  style={{ fontFamily: "La Mango" }}
                  className="mb-5 text-2xl text-gray-800 order-first"
                >
                  @zulasnmore_india
                </p>
              </div>

              {/* Right Section - Image Grid */}
              <div className="grid grid-cols-2 gap-4 justify-center">
                {reels.slice(1).map((reel, idx) => (
                  <div
                    key={idx}
                    className="relative w-64 h-64 rounded-4xl overflow-hidden shadow-md group"
                  >
                    {reel.image ? (
                      <a
                        href={reel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`${API_URL}${reel.image}`}
                          alt={reel.alt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-white text-3xl font-bold">
                            <IoLogoInstagram />
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LastSection;
