import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import RoleToggle from '../RoleToggle/roletoggle';
import { toast } from 'react-toastify'; // ✅ import toast

export default function Register() {
    const [role, setRole] = useState('tenant');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();

        // Example registration check
        if (formData.name && formData.email.includes('@') && formData.password.length >= 6) {
            toast.success(`Registered successfully as ${role.charAt(0).toUpperCase() + role.slice(1)}!`);
        } else {
            toast.error('Please fill all fields correctly.');
        }

        console.log(`Registering as ${role}`, formData);
    };

    return (
        <div className="min-h-[35rem] flex justify-center items-center px-4 pt-32">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-[#1F2937] mb-4 text-center">
                    Register as {role === 'tenant' ? 'Tenant' : 'Landlord'}
                </h2>

                <RoleToggle role={role} setRole={setRole} />

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <div className="relative">
                        <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            required
                            className="pl-10 w-full py-2 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                            className="pl-10 w-full py-2 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            className="pl-10 w-full py-2 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-[#10B981] hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
