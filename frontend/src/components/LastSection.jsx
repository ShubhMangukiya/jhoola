import React from "react";
import p1 from "../image/p1.png";
import p2 from "../image/p2.png";
import p3 from "../image/p3.png";
import p4 from "../image/p4.png";
import p5 from "../image/p5.png";
import { IoLogoInstagram } from "react-icons/io5";

import Background from "./Background";

const LastSection = () => {
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
                  <img
                    src={p1}
                    alt="Instagram"
                    className="w-full h-full object-cover"
                  />
                  {/* Instagram Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black  bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-3xl font-bold"><IoLogoInstagram /></div>
                  </div>
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
              <div className="grid grid-cols-2 gap-4">
                {/* Image 1 */}
                <div className="relative rounded-4xl overflow-hidden shadow-md group">
                  <img
                    src={p2}
                    alt="Swing 1"
                    className="w-full h-full object-cover"
                  />
                  {/* Instagram Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black   bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-3xl font-bold"><IoLogoInstagram /></div>
                  </div>
                </div>
                {/* Image 2 */}
                <div className="relative rounded-4xl overflow-hidden shadow-md group">
                  <img
                    src={p3}
                    alt="Swing 2"
                    className="w-full h-full object-cover"
                  />
                  {/* Instagram Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black   bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-3xl font-bold"><IoLogoInstagram /></div>
                  </div>
                </div>
                {/* Image 3 */}
                <div className="relative rounded-4xl overflow-hidden shadow-md group">
                  <img
                    src={p4}
                    alt="Swing 3"
                    className="w-full h-full object-cover"
                  />
                  {/* Instagram Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-3xl font-bold"><IoLogoInstagram /></div>
                  </div>
                </div>
                {/* Image 4 */}
                <div className="relative rounded-4xl overflow-hidden shadow-md group">
                  <img
                    src={p5}
                    alt="Swing 4"
                    className="w-full h-full object-cover"
                  />
                  {/* Instagram Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-3xl font-bold"><IoLogoInstagram /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LastSection;
