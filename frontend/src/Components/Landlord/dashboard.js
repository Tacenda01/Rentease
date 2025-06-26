import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [name, setName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) setName(storedName);
  }, []);

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || '?';
    return (names[0][0] + names[1][0])?.toUpperCase() || '?';
  };


  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
          {getInitials(name)}
        </div>
        <div className="ml-3 text-lg font-medium text-gray-800">
          {name ? `Hi, ${name}` : 'Hi there'}
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      {/* Stats cards, alerts, charts go here */}
    </div>
  );
}
