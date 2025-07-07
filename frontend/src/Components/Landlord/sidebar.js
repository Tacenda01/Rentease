import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaMoneyCheckAlt,
  FaUserCog,
} from 'react-icons/fa';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const navItems = [
  { label: 'My Properties', to: '/landlord/properties', icon: <FaHome /> },
  { label: 'Bookings', to: '/landlord/bookings', icon: <FaCalendarAlt /> },
  { label: 'Messages', to: '/landlord/messages', icon: <FaComments /> },
  { label: 'Earnings', to: '/landlord/earnings', icon: <FaMoneyCheckAlt /> },
  { label: 'Profile Settings', to: '/landlord/profile', icon: <FaUserCog /> },
];

function Sidebar({ collapsed, setCollapsed }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h1 className={`text-xl font-bold text-sky-500 ${!isMobile && collapsed ? 'hidden' : 'block'}`}>
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

      <nav className="flex-1 flex flex-col gap-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all
              ${isActive
                ? 'bg-sky-100 text-sky-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {(!collapsed || isMobile) && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 px-3 py-2 rounded-md hover:bg-red-50 transition w-full"
        >
          <FiLogOut className="text-xl" />
          {(!collapsed || isMobile) && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <div
        className={`fixed z-40 top-0 left-0 h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'} hidden md:flex flex-col`}
      >
        <SidebarContent />
      </div>

      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md border border-gray-200"
        onClick={() => setMobileOpen(true)}
      >
        <FiMenu className="text-2xl text-sky-500" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white h-full shadow-lg flex flex-col">
            <SidebarContent isMobile />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
}

export default Sidebar;
