import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import {
    FaUsers,
    FaBuilding,
    FaClipboardList,
    FaMoneyBill,
    FaStarHalfAlt,
    FaBell,
    FaCogs,
} from 'react-icons/fa';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import { toast } from 'react-toastify';

const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <MdDashboard /> },
    { label: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { label: 'Properties', path: '/admin/properties', icon: <FaBuilding /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <FaClipboardList /> },
    { label: 'Transactions', path: '/admin/transactions', icon: <FaMoneyBill /> },
    { label: 'Reviews', path: '/admin/reviews', icon: <FaStarHalfAlt /> },
    { label: 'Notifications', path: '/admin/notifications', icon: <FaBell /> },
    { label: 'Settings', path: '/admin/settings', icon: <FaCogs /> },
];

const AdminSidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div className="md:hidden p-3">
                <button onClick={() => setMobileOpen(!mobileOpen)}>
                    <FiMenu className="text-2xl text-sky-500" />
                </button>
            </div>
            <aside
                className={`fixed z-50 md:z-auto top-0 left-0 h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'block' : 'hidden'} 
          md:block`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200">
                        <h1
                            className={`text-xl font-bold text-sky-500 transition-all duration-200 ${collapsed ? 'hidden' : 'block'}`}
                        >
                            Admin Panel
                        </h1>
                        <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block">
                            <FiMenu className="text-gray-600 text-lg" />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-1 p-2 flex-grow">
                        {adminNavItems.map(({ label, path, icon }) => (
                            <Link
                                to={path}
                                key={path}
                                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all
                  ${isActive(path)
                                        ? 'bg-sky-100 text-sky-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <span className="text-xl">{icon}</span>
                                {!collapsed && <span className="text-sm">{label}</span>}
                            </Link>
                        ))}

                        <div className="mt-auto pt-4 border-t border-slate-200">
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    toast.success('Logged out successfully');
                                    setTimeout(() => {
                                        window.location.href = '/login';
                                    }, 500);
                                }}
                                className="flex items-center gap-3 text-red-500 px-3 py-2 rounded-md hover:bg-red-50 transition w-full"
                            >
                                <FiLogOut className="text-xl" />
                                {!collapsed && <span className="text-sm">Logout</span>}
                            </button>

                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;