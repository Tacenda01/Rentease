import { useState } from 'react';
// AdminLayout.jsx
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div
                className={`flex-1 bg-[#F9FAFB] min-h-screen p-4 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                {children}
            </div>
        </div>
    );
}
