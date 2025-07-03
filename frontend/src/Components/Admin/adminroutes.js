import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Users from './Users';
import Properties from './Properties';
import BookingRequests from '../Landlord/bookingrequests';
import Transactions from './Transactions';
import Notifications from './Notifications';

function AdminRoutes() {
    const isAdmin = localStorage.getItem('adminRole') === 'admin';

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <AdminLayout>
            <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="properties" element={<Properties />} />
                <Route path="bookings" element={<BookingRequests />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
        </AdminLayout>
    );
}

export default AdminRoutes;
