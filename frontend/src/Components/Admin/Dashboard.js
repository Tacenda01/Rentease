import { useEffect, useState } from 'react';
import {
    FaUsers,
    FaBuilding,
    FaClipboardList,
    FaMoneyBill,
    FaBell,
    FaHome
} from "react-icons/fa";
import { MdDashboard } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
    const [name, setName] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalLandlords, setTotalLandlords] = useState(0);
    const [totalTenants, setTotalTenants] = useState(0);
    const [totalProperties, setTotalProperties] = useState(0);
    const [propertyTypes, setPropertyTypes] = useState({
        apartment: 0,
        house: 0,
        studio: 0,
        villa: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        const storedName = localStorage.getItem('adminName');
        if (storedName) setName(storedName);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const userRes = await axios.get('http://localhost:5000/api/user/user-stats');
            setTotalLandlords(userRes.data.landlords);
            setTotalTenants(userRes.data.tenants);
            setTotalUsers(userRes.data.landlords + userRes.data.tenants);

            const propertyRes = await axios.get('http://localhost:5000/api/user/property-stats');
            setTotalProperties(propertyRes.data.total);
            setPropertyTypes(propertyRes.data.types);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const getInitials = (fullName) => {
        if (!fullName) return '?';
        const names = fullName.trim().split(' ');
        if (names.length === 1) return names[0][0]?.toUpperCase() || '?';
        return (names[0][0] + names[1][0])?.toUpperCase() || '?';
    };

    const shortcutSections = [
        {
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: <MdDashboard className="text-xl text-sky-500" />,
        },
        {
            title: "Users",
            path: "/admin/users",
            icon: <FaUsers className="text-xl text-emerald-500" />,
        },
        {
            title: "Properties",
            path: "/admin/properties",
            icon: <FaBuilding className="text-xl text-amber-500" />,
        },
        {
            title: "Bookings",
            path: "/admin/bookings",
            icon: <FaClipboardList className="text-xl text-indigo-500" />,
        },
        {
            title: "Transactions",
            path: "/admin/transactions",
            icon: <FaMoneyBill className="text-xl text-purple-500" />,
        },
        {
            title: "Notifications",
            path: "/admin/notifications",
            icon: <FaBell className="text-xl text-gray-700" />,
        },
    ];

    return (
        <div className="p-6 pt-16 sm:pt-6">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    {getInitials(name)}
                </div>
                <div className="ml-3 text-lg font-medium text-gray-800">
                    {name ? `Hi, ${name}` : 'Hi there'}
                </div>
            </div>

            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <Card title="Total Users" value={totalUsers} icon={<FaUsers />} color="bg-sky-500" />
                <Card title="Landlords" value={totalLandlords} icon={<FaBuilding />} color="bg-emerald-500" />
                <Card title="Tenants" value={totalTenants} icon={<FaUsers />} color="bg-indigo-500" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <Card title="Total Properties" value={totalProperties} icon={<FaClipboardList />} color="bg-purple-500" />
                <Card title="Apartments" value={propertyTypes.apartment} icon={<FaBuilding />} color="bg-pink-500" />
                <Card title="Houses" value={propertyTypes.house} icon={<FaHome />} color="bg-yellow-500" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <Card title="Studios" value={propertyTypes.studio} icon={<FaHome />} color="bg-blue-500" />
                <Card title="Villas" value={propertyTypes.villa} icon={<FaHome />} color="bg-red-500" />
            </div>

            <h2 className="text-xl font-semibold text-[#1F2937] mt-6 mb-3">Quick Access</h2>

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

function Card({ title, value, icon, color }) {
    return (
        <div className="flex items-center gap-4 p-5 rounded-xl shadow-sm border border-slate-200 bg-white hover:shadow-md transition">
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${color} text-white text-xl`}>
                {icon}
            </div>
            <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    );
}
