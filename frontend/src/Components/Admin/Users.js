import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

export default function Users() {
    const [tenants, setTenants] = useState([]);
    const [landlords, setLandlords] = useState([]);
    const [tenantSearch, setTenantSearch] = useState("");
    const [landlordSearch, setLandlordSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const [tenantRes, landlordRes] = await Promise.all([
                axios.get("http://localhost:5000/api/user/tenants"),
                axios.get("http://localhost:5000/api/user/landlords"),
            ]);
            setTenants(tenantRes.data);
            setLandlords(landlordRes.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const toggleBlock = async (email, role, currentBlocked) => {
        try {
            await axios.patch("http://localhost:5000/api/user/block", {
                email,
                role,
                blocked: !currentBlocked,
            });
            fetchUsers();
        } catch (error) {
            console.error(`Failed to ${currentBlocked ? "unblock" : "block"} user:`, error);
        }
    };

    const filterUsers = (users, query) => {
        const q = query.toLowerCase();
        return users.filter(
            (u) =>
                u.first_name.toLowerCase().includes(q) ||
                u.last_name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                (u.phone && u.phone.includes(q))
        );
    };

    return (
        <div className="p-6 mt-16 md:mt-0 max-w-6xl mx-auto space-y-12 bg-gray-50 min-h-screen">
            {/* TENANTS */}
            <section className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Tenants</h2>
                <div className="relative mb-4 w-full md:w-1/3">
                    <FaSearch className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tenants..."
                        value={tenantSearch}
                        onChange={(e) => setTenantSearch(e.target.value)}
                        className="pl-10 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border rounded-md">
                        <thead className="bg-blue-100 text-blue-700">
                            <tr>
                                <th className="p-3 text-left">First Name</th>
                                <th className="p-3 text-left">Last Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterUsers(tenants, tenantSearch).map((tenant) => (
                                <tr key={tenant.id} className="odd:bg-white even:bg-gray-50">
                                    <td className="p-3">{tenant.first_name}</td>
                                    <td className="p-3">{tenant.last_name}</td>
                                    <td className="p-3">{tenant.email}</td>
                                    <td className="p-3">{tenant.phone || "-"}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() =>
                                                toggleBlock(tenant.email, "tenant", tenant.blocked)
                                            }
                                            className={`px-3 py-1 text-xs font-medium rounded ${tenant.blocked
                                                    ? "bg-green-500 text-white"
                                                    : "bg-red-500 text-white"
                                                }`}
                                        >
                                            {tenant.blocked ? "Unblock" : "Block"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* LANDLORDS */}
            <section className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Landlords</h2>
                <div className="relative mb-4 w-full md:w-1/3">
                    <FaSearch className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search landlords..."
                        value={landlordSearch}
                        onChange={(e) => setLandlordSearch(e.target.value)}
                        className="pl-10 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border rounded-md">
                        <thead className="bg-emerald-100 text-emerald-700">
                            <tr>
                                <th className="p-3 text-left">First Name</th>
                                <th className="p-3 text-left">Last Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterUsers(landlords, landlordSearch).map((landlord) => (
                                <tr key={landlord.id} className="odd:bg-white even:bg-gray-50">
                                    <td className="p-3">{landlord.first_name}</td>
                                    <td className="p-3">{landlord.last_name}</td>
                                    <td className="p-3">{landlord.email}</td>
                                    <td className="p-3">{landlord.phone || "-"}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() =>
                                                toggleBlock(
                                                    landlord.email,
                                                    "landlord",
                                                    landlord.blocked
                                                )
                                            }
                                            className={`px-3 py-1 text-xs font-medium rounded ${landlord.blocked
                                                    ? "bg-green-500 text-white"
                                                    : "bg-red-500 text-white"
                                                }`}
                                        >
                                            {landlord.blocked ? "Unblock" : "Block"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
