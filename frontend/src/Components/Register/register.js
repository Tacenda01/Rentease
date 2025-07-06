import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import RoleToggle from '../RoleToggle/roletoggle';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [role, setRole] = useState('tenant');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
    });

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();

        const { firstName, lastName, email, password, phone } = formData;

        if (
            firstName &&
            lastName &&
            email.includes('@') &&
            password.length >= 4 &&
            phone.length >= 8
        ) {
            try {
                const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password,
                        phone,
                        role,
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    toast.success(data.message || 'Registered successfully!');
                    setTimeout(() => navigate('/login'), 2000);
                    setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        phone: '',
                    });
                } else {
                    toast.error(data.error || 'Registration failed.');
                }
            } catch (error) {
                toast.error('Server error. Please try again.');
            }
        } else {
            toast.error('Please fill all fields correctly.');
        }
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
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="pl-10 w-full py-2 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="pl-10 w-full py-2 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
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
                            value={formData.email}
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
                            value={formData.password}
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

                <p className="text-sm text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
