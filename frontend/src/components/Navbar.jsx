import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Menu from "../image/Menu.svg";
import logo from "../image/logo.png";
import Cart from "../image/Cart.svg";
import Wishlist from "../image/Wishlist.svg";
import User from "../image/User.svg";
import { API_URL, userToken } from "./Variable";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const userData = userToken();
  const token = userData?.token;
  const navigate = useNavigate();

  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleUserClick = () => {
    navigate("/profile");
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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
            onClick={closeMenu}
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
        <div className="flex  items-center space-x-3 ">
          {/* Cart */}
          <Link to="/Cart" onClick={closeMenu} className=" rounded-full">
            <img
              src={Cart || "/placeholder.svg"}
              className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 cursor-pointer"
              alt="Cart"
            />
          </Link>
          {/* Wishlist */}
          <Link to="/Wishlist" onClick={closeMenu} className=" rounded-full">
            <img
              src={Wishlist || "/placeholder.svg"}
              className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 cursor-pointer"
              alt="Wishlist"
            />
          </Link>
          {/* User Account */}
          {/* User Account - REPLACE Link with button and handle click */}
          <button
            onClick={handleUserClick}
            className="rounded-full p-0 m-0"
            aria-label="Account"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <img
              src={User || "/placeholder.svg"}
              className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700"
              alt="Account"
            />
          </button>
        </div>

        {/* Dropdown Menu - Responsive */}
        {/* {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white w-full z-50 p-4 ">
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

            <ul className="text-center font-semibold flex flex-col space-y-2 sm:space-y-0 sm:flex-row flex-wrap gap-y-2 sm:gap-x-4 md:gap-x-6 lg:gap-x-9 items-center justify-center">
              {[
                { to: "/", label: "Home" },
                { to: "/AllProduct", label: "All Products" },
                { to: "/Shopby", label: "Shop by Categories" },
                { to: "/Newproduct", label: "New Products" },
                { to: "/Ourstory", label: "Our Story" },
                { to: "/Contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="block py-2 text-gray-800 hover:text-lime-950"
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )} */}
        {menuOpen && (
          <div
            ref={menuRef}
            id="menu-mobile"
            className="absolute top-full left-0 right-0 bg-white w-full z-50 p-4 shadow-lg"
          >
            {/* Search Bar */}
            <div className="relative flex items-center justify-center mb-4">
              <form
                className="relative w-full max-w-xs mx-auto"
              >
                <input
                  type="text"
                  placeholder="Search Product..."
                  className="w-full px-4 py-3 pl-10 pr-12 border text-white bg-lime-950 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2c3118]"
                  aria-label="Search products"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-[#2c3118]"
                  aria-label="Submit search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>
            <div className="border-t border-black mb-3"></div>

            {/* Navigation Links - Responsive */}
            <ul className="text-center font-semibold flex flex-col space-y-2 sm:space-y-0 sm:flex-row flex-wrap gap-y-2 sm:gap-x-4 md:gap-x-6 lg:gap-x-9 items-center justify-center">
              {[
                { to: "/", label: "Home" },
                { to: "/AllProduct", label: "All Products" },
                { to: "/Shopby", label: "Shop by Categories" },
                { to: "/Newproduct", label: "New Products" },
                { to: "/Ourstory", label: "Our Story" },
                { to: "/Contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="block py-2 text-gray-800 hover:text-lime-950"
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
