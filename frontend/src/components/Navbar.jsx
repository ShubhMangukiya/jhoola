"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Menu from "../image/Menu.svg";
import logo from "../image/logo.png";
import Cart from "../image/Cart.svg";
import Wishlist from "../image/wishlist.svg";
import User from "../image/User.svg";

// Hardcode BASE_URL (or import from a config file if preferred)
const BASE_URL = "http://localhost:5000"; // Replace with your backend URL

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInitial, setUserInitial] = useState(null); // Store user's first letter
  const navigate = useNavigate();

  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fetch user data on mount (assuming token is in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming token is stored after login
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  // Fetch user profile from backend
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", // Added for CORS preflight
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.firstName) {
        setUserInitial(data.firstName.charAt(0).toUpperCase());
      } else {
        console.warn("No firstName found in response:", data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      // Optionally alert user or handle silently
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInitial(null);
    navigate("/Loginpage");
  };

  return (
    <div className="bg-white">
      <nav className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex items-center justify-between px-4 py-4 relative">
        {/* Left - Menu Icon */}
        <div>
          <button
            onClick={toggleMenu}
            className="p-1 rounded-full"
            aria-label="Menu"
          >
            <img
              src={Menu || "/placeholder.svg"}
              className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 cursor-pointer"
              alt="Menu Icon"
            />
          </button>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 max-w-[100px] sm:max-w-[150px]">
          <Link
            to="/"
            className="font-serif text-2xl tracking-wider text-[#3a3a3a] block"
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="Zulas logo"
              className="h-auto w-auto"
            />
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center space-x-3">
          {/* Cart */}
          <Link to="/Cart" className="rounded-full">
            <img
              src={Cart || "/placeholder.svg"}
              className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 cursor-pointer"
              alt="Cart"
            />
          </Link>
          {/* Wishlist */}
          <Link to="/Wishlist" className="rounded-full">
            <img
              src={Wishlist || "/placeholder.svg"}
              className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 cursor-pointer"
              alt="Wishlist"
            />
          </Link>
          {/* User Profile - Circle with Initial */}
          {userInitial ? (
            <div className="rounded-full bg-lime-950 text-white flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 cursor-pointer">
              {userInitial}
            </div>
          ) : (
            <Link to="/Loginpage" className="rounded-full">
              <img
                src={User || "/placeholder.svg"}
                className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 cursor-pointer"
                alt="Account"
              />
            </Link>
          )}
          {userInitial && (
            <button
              onClick={handleLogout}
              className="ml-2 text-sm text-gray-700 hover:text-lime-950"
            >
              Logout
            </button>
          )}
        </div>

        {/* Dropdown Menu - Responsive */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white w-full z-50 p-4">
            {/* Search Bar */}
            <div className="relative flex items-center justify-center mb-4">
              <div className="relative w-full max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="Search Product..."
                  className="w-full px-4 py-3 pl-10 border text-white bg-lime-950 rounded-full focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
              </div>
            </div>
            <div className="border-t border-black mb-3"></div>

            {/* Navigation Links - Responsive */}
            <ul className="text-center font-semibold flex flex-col space-y-2 sm:space-y-0 sm:flex-row flex-wrap gap-y-2 sm:gap-x-4 md:gap-x-6 lg:gap-x-9 items-center justify-center">
              <li>
                <Link
                  to="/"
                  className="block py-2 text-gray-800 hover:text-lime-950"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/AllProduct"
                  className="block py-2 text-gray-800 hover:text-lime-950"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/Shopby"
                  className="block py-2 text-gray-800 hover:text-lime-950"
                >
                  Shop by Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/Newproduct"
                  className="block py-2 text-gray-800 hover:text-lime-950"
                >
                  New Products
                </Link>
              </li>
              <li>
                <Link
                  to="/Ourstory"
                  className="block py-2 text-gray-800 hover:text-lime-950"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/Contact"
                  className="block py-2 text-gray-800 hover:text-lime-950"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}