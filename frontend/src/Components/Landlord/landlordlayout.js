import { useState } from 'react';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

function LandlordLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`flex-1 bg-[#F9FAFB] min-h-screen p-4 transition-all duration-300 
          ${collapsed ? 'md:ml-20' : 'md:ml-64'} ml-0`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default LandlordLayout;
