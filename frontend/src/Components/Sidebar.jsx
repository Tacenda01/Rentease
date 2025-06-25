// Sidebar.jsx
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/properties">Properties</Link>
        <Link to="/admin/bookings">Bookings</Link>
        <Link to="/admin/transactions">Transactions</Link>
        <Link to="/admin/reviews">Reviews</Link>
        <Link to="/admin/notifications">Notifications</Link>
        <Link to="/admin/settings">Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
