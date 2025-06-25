import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Users from './Users';
import Properties from './Properties';
import BookingRequests from '../Landlord/bookingrequests';
import Transactions from './Transactions';
import Reviews from './Reviews';
import Notifications from './Notifications';
import Settings from './Settings';
function AdminRoutes() {
    return (
        <Routes>
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="Dashboard" element={<Dashboard />} />
                <Route path="Users" element={<Users />} />
                <Route path="Properties" element={<Properties />} />
                <Route path="Bookings" element={<BookingRequests />} />
                <Route path="Transactions" element={<Transactions />} />
                <Route path="Reviews" element={<Reviews />} />
                <Route path="Notifications" element={<Notifications />} />
                <Route path="Settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;
