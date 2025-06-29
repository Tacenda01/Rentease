import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div
                className={`flex-1 p-4 transition-all duration-300 
          ${collapsed ? 'md:ml-20' : 'md:ml-64'} ml-0`}
            >
                {children}
            </div>
        </div>
    );
}
