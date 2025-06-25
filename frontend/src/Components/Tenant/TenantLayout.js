import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const TenantLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 transition-all duration-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`flex-1 p-4 transition-all duration-300 
          ${collapsed ? 'ml-20' : 'ml-64'}`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default TenantLayout;
