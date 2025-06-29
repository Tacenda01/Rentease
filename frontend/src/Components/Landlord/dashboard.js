import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
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
          const storedFirstName = localStorage.getItem("firstName");
          const storedLastName = localStorage.getItem("lastName");
          if (storedFirstName) setFirstName(storedFirstName);
          if (storedLastName) setLastName(storedLastName);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/user/profile", {
          params: { email, role },
        });

        const data = res.data;
        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName) setLastName(data.lastName);

        localStorage.setItem("firstName", data.firstName || "");
        localStorage.setItem("lastName", data.lastName || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);

        const storedFirstName = localStorage.getItem("firstName");
        const storedLastName = localStorage.getItem("lastName");
        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
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
      title: "My Properties",
      path: "/landlord/properties",
      icon: <FaSearch className="text-xl text-sky-500" />,
    },
    {
      title: "Booking Requests",
      path: "/landlord/bookings",
      icon: <FaCalendarCheck className="text-xl text-emerald-500" />,
    },
    {
      title: "Messages",
      path: "/landlord/messages",
      icon: <FaComments className="text-xl text-indigo-500" />,
    },
    {
      title: "Earnings & Payouts",
      path: "/landlord/earnings",
      icon: <FaMoneyCheck className="text-xl text-purple-500" />,
    },
    {
      title: "Profile Settings",
      path: "/landlord/profile",
      icon: <FaUserCog className="text-xl text-gray-700" />,
    },
  ];

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      {/* User Greeting */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
          {getInitials()}
        </div>
        <div className="ml-3 text-lg font-medium text-gray-800">
          {firstName ? `Hi, ${firstName} ${lastName}` : "Hi there"}
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* Quick Access Cards */}
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Quick Access</h2>
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
      {/* Additional dashboard sections (stats, alerts, charts, etc.) can be added below */}
    </div>
  );
}
