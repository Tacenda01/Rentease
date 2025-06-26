import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRole }) {
    const userRole = localStorage.getItem('role');

    if (!userRole) {
        return <Navigate to="/login" />;
    }

    if (userRole !== allowedRole) {
        return <Navigate to={`/${userRole}/dashboard`} />;
    }

    return <Outlet />;
}
