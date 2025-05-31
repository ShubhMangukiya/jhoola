import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./Admin";
import AdminDashboard from "./AdminDashboard";
import ManageCategories from "./ManageCategories";
import ManageProducts from "./ManageProducts";
import ManageOrders from "./ManageOrders";
import ManageUsers from "./ManageUsers";

const AdminRoutes = () => {
  return (
    <Admin>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/products" element={<ManageProducts />} />
        <Route path="/categories" element={<ManageCategories />} />
        <Route path="/orders" element={<ManageOrders />} />
        <Route path="/users" element={<ManageUsers />} />
      </Routes>
    </Admin>
  );
};

export default AdminRoutes;