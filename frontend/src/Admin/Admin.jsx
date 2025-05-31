import React from 'react';
import Sidebar from './Sidebar';

const Admin = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 ml-64"> {/* Margin to avoid overlap with fixed sidebar */}
        {children}
      </div>
    </div>
  );
};

export default Admin;