import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaSearch,
  FaCalendarCheck,
  FaComments,
  FaMoneyCheck,
  FaUserCog,
} from "react-icons/fa";

export default function Dashboard() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");

        if (!email || !role) {
          return;
        }

        const res = await axios.get("http://localhost:5000/api/user/profile", {
          params: { email, role },
        });

        const data = res.data;

        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName) setLastName(data.lastName);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = () => {
    if (!firstName && !lastName) return "?";
    const f = firstName?.trim()[0] || "";
    const l = lastName?.trim()[0] || "";
    return (f + l).toUpperCase();
  };

  const shortcutSections = [
    {
      title: "Search Properties",
      path: "/tenant/search",
      icon: <FaSearch className="text-xl text-sky-500" />,
    },
    {
      title: "My Bookings",
      path: "/tenant/bookings",
      icon: <FaCalendarCheck className="text-xl text-emerald-500" />,
    },
    {
      title: "Saved Properties",
      path: "/tenant/saved",
      icon: <FaHeart className="text-xl text-amber-500" />,
    },
    {
      title: "Messages",
      path: "/tenant/messages",
      icon: <FaComments className="text-xl text-indigo-500" />,
    },
    {
      title: "Payments",
      path: "/tenant/payments",
      icon: <FaMoneyCheck className="text-xl text-purple-500" />,
    },

    {
      title: "Profile Settings",
      path: "/tenant/profile",
      icon: <FaUserCog className="text-xl text-gray-700" />,
    },
  ];

  return (
    <div className="p-4 bg-[#F9FAFB] min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center text-sm font-bold">
          {getInitials()}
        </div>
        <div className="text-lg font-medium text-gray-800">
          {firstName ? `Hi, ${firstName} ${lastName}` : "Hi there"}
        </div>
      </div>

      {/* Section Title */}
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-4">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      {/* Shortcut Cards to Other Sections */}
      <h2 className="text-xl font-semibold text-[#1F2937] mb-3">Quick Access</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcutSections.map(({ title, path, icon }) => (
          <div
            key={path}
            onClick={() => navigate(path)}
            className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex items-center gap-4"
          >
            {icon}
            <span className="font-medium text-gray-700">{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
