import React from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
const Header = ({ toggleSidebar }) => {
  const location = useLocation();

  // Map paths to titles
  const titles = {
    '/admin': 'Dashboard',
    '/admin/category': 'Category Management',
    '/admin/products':"Product Management ",
    '/admin/color':"Color Management",
    '/admin/orders':'Order Management'
  };
  const title = titles[location.pathname] || 'Dashboard';
  return (
    <header className="flex justify-between items-center px-4 py-3 bg-white shadow-sm sm:px-6">
      <div className="flex items-center space-x-3">
        <button className="sm:hidden" onClick={toggleSidebar}>
          <Menu />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="hidden sm:inline-block bg-[#262B0D] text-white px-4 py-2 rounded text-sm">Log out</button>
        <div className="w-10 h-10 rounded-full bg-gray-300" />
      </div>
    </header>
  );
};

export default Header;
