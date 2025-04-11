import React from 'react';
import { Outlet } from 'react-router-dom';

interface AdminProps {
  isSidebarOpen: boolean;
}

const Admin: React.FC<AdminProps> = ({ isSidebarOpen }) => {

  return (
    <div className="bg-gray-50">
      <div
        className={`h-screen p-9 transition-all duration-300 ${
          isSidebarOpen ? 'ml-[260px]' : ''
        }`}
      >
        <Outlet />
        
      </div>
    </div>
    
  );
};

export default Admin;
