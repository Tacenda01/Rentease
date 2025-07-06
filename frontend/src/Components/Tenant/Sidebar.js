import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FaSearch,
  FaCalendarCheck,
  FaComments,
  FaMoneyCheck,
  FaUserCog,
} from 'react-icons/fa';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const navItems = [
  { label: 'Search Properties', path: '/tenant/search', icon: <FaSearch /> },
  { label: 'My Bookings', path: '/tenant/bookings', icon: <FaCalendarCheck /> },
  { label: 'Messages', path: '/tenant/messages', icon: <FaComments /> },
  { label: 'Payments', path: '/tenant/payments', icon: <FaMoneyCheck /> },
  { label: 'Profile Settings', path: '/tenant/profile', icon: <FaUserCog /> },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  const SidebarContent = ({ isMobile }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h1 className={`text-xl font-bold text-sky-500 ${collapsed && !isMobile ? 'hidden' : 'block'}`}>
          RentEase
        </h1>
        <button
          onClick={() => {
            if (isMobile) {
              setMobileOpen(false);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className="text-gray-600 hover:text-sky-500"
        >
          {isMobile ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-grow">
        {navItems.map(({ label, path, icon }) => (
          <Link
            to={path}
            key={path}
            onClick={() => isMobile && setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all
              ${isActive(path)
                ? 'bg-sky-100 text-sky-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="text-xl">{icon}</span>
            {!collapsed || isMobile ? <span className="text-sm">{label}</span> : null}
          </Link>
        ))}
        <div className="mt-auto pt-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 px-3 py-2 rounded-md hover:bg-red-50 transition w-full"
          >
            <FiLogOut className="text-xl" />
            {!collapsed || isMobile ? <span className="text-sm">Logout</span> : null}
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-white p-2 rounded-md shadow-md border border-gray-200"
        >
          <FiMenu className="text-2xl text-sky-500" />
        </button>
      </div>

      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'} hidden md:flex flex-col`}
      >
        <SidebarContent isMobile={false} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white h-full shadow-lg flex flex-col">
            <SidebarContent isMobile={true} />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
