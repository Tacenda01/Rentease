import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import RoleToggle from '../RoleToggle/roletoggle';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [role, setRole] = useState('tenant');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || 'Login successful!');

                localStorage.setItem('userId', data.id);
                localStorage.setItem('role', role);
                localStorage.setItem('email', data.email);
                localStorage.setItem('firstName', data.firstName);
                localStorage.setItem('lastName', data.lastName);

                if (role === 'landlord') {
                    localStorage.setItem('landlordId', data.id);
                    navigate('/landlord/dashboard');
                } else if (role === 'tenant') {
                    navigate('/tenant/dashboard');
                }
            } else {
                toast.error(data.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error(error);
            toast.error('Server error. Please try again.');
        }
    };

    return (
        <div className="min-h-[35rem] flex justify-center items-center px-4 pt-32">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-[#1F2937] mb-4 text-center">
                    Login as {role === 'tenant' ? 'Tenant' : 'Landlord'}
                </h2>

                <RoleToggle role={role} setRole={setRole} />

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
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
                        className="w-full py-2 bg-[#3B82F6] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">
                        Register now
                    </Link>
                </p>
            </div>
        </div>
    );
}
