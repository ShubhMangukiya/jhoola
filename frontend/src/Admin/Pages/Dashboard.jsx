import React, { useState } from 'react';
import Sidebar from '../Component/Sidebar';
import Header from '../Component/Header';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex  overflow-hidden">
      Dashboard
    </div>
  );
}

export default Dashboard;
