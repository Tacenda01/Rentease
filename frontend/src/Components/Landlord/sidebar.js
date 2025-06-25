import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { MdDashboard } from 'react-icons/md';
import { FaHome, FaCalendarAlt, FaComments, FaMoneyCheckAlt, FaStar, FaUserCog } from 'react-icons/fa';
import { FiLogOut, FiMenu } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', to: '/landlord/dashboard', icon: <MdDashboard /> },
  { label: 'My Properties', to: '/landlord/properties', icon: <FaHome /> },
  { label: 'Booking Requests', to: '/landlord/bookings', icon: <FaCalendarAlt /> },
  { label: 'Messages', to: '/landlord/messages', icon: <FaComments /> },
  { label: 'Earnings & Payouts', to: '/landlord/earnings', icon: <FaMoneyCheckAlt /> },
  { label: 'Reviews', to: '/landlord/reviews', icon: <FaStar /> },
  { label: 'Profile Settings', to: '/landlord/profile', icon: <FaUserCog /> },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-white border-r border-slate-200 h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} hidden md:flex flex-col fixed z-30`}>
      {/* Header + Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        {!collapsed && <span className="text-xl font-bold text-blue-600">RentEase</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-600 hover:text-blue-500">
          <FiMenu size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 transition rounded-r-full border-l-4 ${
                isActive ? 'bg-blue-100 text-blue-600 border-blue-500 font-semibold' : 'border-transparent'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => {
            // TODO: Implement logout handler
            console.log('Logging out...');
          }}
          className="flex items-center gap-3 w-full text-gray-700 hover:bg-rose-100 px-4 py-2 rounded-r-full transition"
        >
          <FiLogOut className="text-xl" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
