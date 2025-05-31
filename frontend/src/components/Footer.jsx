import { Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../image/logo zulas.svg";

export default function Footer() {
  return (
    <footer className="bg-lime-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Logo and Description */}
        <div className="flex flex-col md:flex-row justify-between mb-12 gap-8">
          <div className="max-w-md">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src={logo}
                alt="Zulas Logo"
                width={120}
                height={60}
                className="mb-4"
              />
            </Link>
          </div>
          <p className="text-sm leading-relaxed items-">
            Zulas n More is a leading force in the world of furniture
            manufacturing, driven by a relentless commitment to craftsmanship,<br/>
            innovation, and design excellence. Having cumulative experience of
            15+ Years.
          </p>
        </div>

        {/* Main Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Shop</h3>
            <ul className="space-y-3">
              {["Single Seats Swings", "Acrylic Swings", "Outdoor Swings", "Macrame Swings", "SS Swings", "Wooden Swings", "Designer Swings"].map((item, index) => (
                <li key={index}>
                  <Link to="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Link</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "All Product", path: "/AllProduct" },
                { name: "Shop by Categories", path: "/Shopby" },
                { name: "New Product", path: "/Newproduct" },
                { name: "Our Story", path: "/Ourstory" },
                { name: "Offers", path: "#" },
                { name: "Contact", path: "/Contact" }
              ].map((link, index) => (
                <li key={index}>
                  <Link to={link.path} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Have Question? */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Have Question?</h3>
            <ul className="space-y-3">
              {[
                {name: "Shipping Information", path:"/Shipping Information"},
                 {name: "Return & Exchange" ,path:"/Return & Exchange"}].map((item, index) => (
                <li key={index}>
                  <Link to={item.path} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:underline">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join Our Community */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Join Our Community</h3>
            <p className="mb-4 text-sm">
              Enter your email below to be the first to know about new
              collections and product launches.
            </p>

            {/* Newsletter Form */}
            <div className="relative mb-6">
              <input
                type="email"
                placeholder="Enter Your e-mail"
                className="w-full py-3 px-4 bg-white text-gray-800 rounded-full pr-12"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2"
                aria-label="Subscribe"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {[Instagram, Facebook, Youtube].map((Icon, index) => (
                <Link
                  key={index}
                  to="#"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-[#2a3a14] transition-colors"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-white-700 mt-12 pt-6 text-center">
        <p>© ZULAS N MORE 2023</p>
      </div>
    </footer>
  );
}
