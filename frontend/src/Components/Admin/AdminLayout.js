import { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div
                className={`flex-1 bg-[#F9FAFB] min-h-screen p-4 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
