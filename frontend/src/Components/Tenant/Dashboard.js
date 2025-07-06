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

    </div>
  );
}
