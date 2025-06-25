import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import {
  FaSearch,
  FaCalendarCheck,
  FaHeart,
  FaComments,
  FaMoneyCheck,
  FaStar,
  FaUserCog,
} from 'react-icons/fa';
import { FiLogOut, FiMenu } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', path: '/tenant/dashboard', icon: <MdDashboard /> },
  { label: 'Search Properties', path: '/tenant/search', icon: <FaSearch /> },
  { label: 'My Bookings', path: '/tenant/bookings', icon: <FaCalendarCheck /> },
  { label: 'Saved Properties', path: '/tenant/saved', icon: <FaHeart /> },
  { label: 'Messages', path: '/tenant/messages', icon: <FaComments /> },
  { label: 'Payments', path: '/tenant/payments', icon: <FaMoneyCheck /> },
  { label: 'Reviews', path: '/tenant/reviews', icon: <FaStar /> },
  { label: 'Profile Settings', path: '/tenant/profile', icon: <FaUserCog /> },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
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
              className={`text-xl font-bold text-sky-500 transition-all duration-200 ${collapsed ? 'hidden' : 'block'
                }`}
            >
              RentEase
            </h1>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block">
              <FiMenu className="text-gray-600 text-lg" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-2 flex-grow">
            {navItems.map(({ label, path, icon }) => (
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

export default Sidebar;
