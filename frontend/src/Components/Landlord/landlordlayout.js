import React from 'react';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

function LandlordLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64 bg-[#F9FAFB] min-h-screen p-4">
        <Outlet /> {/* this is where nested pages render */}
      </div>
    </div>
  );
}

export default LandlordLayout;
