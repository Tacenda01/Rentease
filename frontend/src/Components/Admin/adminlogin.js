import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function AdminLogin() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/auth/login-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Login failed');
                return;
            }

            localStorage.setItem('adminName', data.name);
            localStorage.setItem('adminEmail', data.email);
            localStorage.setItem('adminRole', data.role);

            toast.success('Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Server error. Try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gray-100">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-[#1F2937] mb-4">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Admin Email"
                            onChange={handleChange}
                            required
                            className="pl-10 w-full py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                            className="pl-10 w-full py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition"
                    >
                        Login
                    </button>
                </form>
            </div>
            <div className="text-center mt-4">
                <a href="/" className="text-blue-600 hover:underline text-sm">
                    ← Return to Home
                </a>
            </div>
        </div>
    );

}
