import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';

const TenantLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');

        if (!email || !role) {
          const f = localStorage.getItem('firstName');
          const l = localStorage.getItem('lastName');
          if (f) setFirstName(f);
          if (l) setLastName(l);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/user/profile', {
          params: { email, role },
        });

        const data = res.data;
        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName) setLastName(data.lastName);

        localStorage.setItem('firstName', data.firstName || '');
        localStorage.setItem('lastName', data.lastName || '');
      } catch (err) {
        console.error('Profile fetch error:', err);
        const f = localStorage.getItem('firstName');
        const l = localStorage.getItem('lastName');
        if (f) setFirstName(f);
        if (l) setLastName(l);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = () => {
    const f = firstName?.trim()[0] || '';
    const l = lastName?.trim()[0] || '';
    return (f + l).toUpperCase() || '?';
  };

  return (
    <div className="flex min-h-screen bg-gray-50 transition-all duration-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`flex-1 p-4 transition-all duration-300 
          ${collapsed ? 'md:ml-20' : 'md:ml-64'} ml-0`}
      >
        <div className="flex justify-center md:justify-start items-center mt-4 md:mt-0 md:ml-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-base font-bold shadow-md">
              {getInitials()}
            </div>
            <div className="text-lg font-semibold text-gray-800">
              Hi, {firstName} {lastName}
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default TenantLayout;
