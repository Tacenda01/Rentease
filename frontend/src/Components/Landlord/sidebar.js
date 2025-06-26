import { NavLink } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import {
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaMoneyCheckAlt,
  FaStar,
  FaUserCog,
} from 'react-icons/fa';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import { toast } from 'react-toastify';

const navItems = [
  { label: 'Dashboard', to: '/landlord/dashboard', icon: <MdDashboard /> },
  { label: 'My Properties', to: '/landlord/properties', icon: <FaHome /> },
  { label: 'Booking Requests', to: '/landlord/bookings', icon: <FaCalendarAlt /> },
  { label: 'Messages', to: '/landlord/messages', icon: <FaComments /> },
  { label: 'Earnings & Payouts', to: '/landlord/earnings', icon: <FaMoneyCheckAlt /> },
  { label: 'Reviews', to: '/landlord/reviews', icon: <FaStar /> },
  { label: 'Profile Settings', to: '/landlord/profile', icon: <FaUserCog /> },
];

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div
      className={`fixed z-50 md:z-auto top-0 left-0 h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out 
        ${collapsed ? 'w-20' : 'w-64'} hidden md:flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h1
          className={`text-xl font-bold text-sky-500 transition-all duration-200 ${collapsed ? 'hidden' : 'block'
            }`}
        >
          RentEase
        </h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-sky-500"
        >
          <FiMenu className="text-lg" />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all
              ${isActive
                ? 'bg-sky-100 text-sky-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
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
    </div>
  );
}

export default Sidebar;
