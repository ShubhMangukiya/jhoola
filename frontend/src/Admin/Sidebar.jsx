import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-6">
        <Link to="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-700">
          Dashboard
        </Link>
        <Link to="/admin/products" className="block py-2 px-4 hover:bg-gray-700">
          Manage Products
        </Link>
        <Link to="/admin/categories" className="block py-2 px-4 hover:bg-gray-700">
          Manage Categories
        </Link>
        <Link to="/admin/orders" className="block py-2 px-4 hover:bg-gray-700">
          Manage Orders
        </Link>
        <Link to="/admin/users" className="block py-2 px-4 hover:bg-gray-700">
          Manage Users
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;