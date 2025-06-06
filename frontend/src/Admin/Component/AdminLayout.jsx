import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom"; // <-- Ye import karo
import AdminRoute from "../AdminRoute";
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col">
          <Header toggleSidebar={toggleSidebar} />
          <main className="p-4">
            <Outlet />{" "}
            {/* <-- Ye zaruri hai taaki nested route ka component dikhe */}
          </main>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminLayout;
