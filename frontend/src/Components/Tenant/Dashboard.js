import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function Dashboard() {
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);
  }, []);

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || '?';
    return (names[0][0] + names[1][0])?.toUpperCase() || '?';
  };

  return (
    <div className="p-4 bg-[#F9FAFB] min-h-screen">
      {/* User avatar + greeting */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center text-sm font-bold">
          {getInitials(name)}
        </div>
        <div className="text-lg font-medium text-gray-800">
          {name ? `Hi, ${name}` : "Hi there"}
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-[#1F2937] mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow border border-[#D1D5DB]">
          <h2 className="text-lg font-medium text-[#1F2937]">Active Bookings</h2>
          <p className="text-[#10B981] font-semibold text-xl">3</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow border border-[#D1D5DB]">
          <h2 className="text-lg font-medium text-[#1F2937]">Cancelled Bookings</h2>
          <p className="text-[#EF4444] font-semibold text-xl">1</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow border border-[#D1D5DB] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#1F2937]">Saved Listings</h2>
            <p className="text-[#F59E0B] font-semibold text-xl">5</p>
          </div>
          <FaHeart className="text-[#F59E0B] text-3xl" />
        </div>
      </div>
    </div>
  );
}
