import { ArrowUpRight } from "lucide-react";
import Home from "../image/Home.svg";

export default function Mainh() {
  return (
    <div className="relative max-w-7xl mx-auto my-8">
      {/* Image Container */}
      <div className="overflow-hidden rounded-3xl shadow-lg">
        <img
          src={Home}
          alt="Cozy Swing"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition">
        <ArrowUpRight size={24} className="text-gray-700" />
      </button>
    </div>
  );
}
