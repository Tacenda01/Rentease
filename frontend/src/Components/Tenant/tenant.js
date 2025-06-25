import { Routes, Route } from 'react-router-dom';
import TenantLayout from './TenantLayout'; // Make sure the path is correct
import Dashboard from './Dashboard';
import SearchProperties from './SearchProperties';
import MyBookings from './MyBookings';
import SavedProperties from './SavedProperties';
import Messages from './Messages';
import Payments from './Payments';
import Reviews from './Reviews';
import ProfileSettings from './ProfileSettings';
import Logout from './Logout';

export default function TenantRoutes() {
  return (
    <Routes>
      <Route path="/tenant" element={<TenantLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="search" element={<SearchProperties />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="saved" element={<SavedProperties />} />
        <Route path="messages" element={<Messages />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
      
      {/* Logout should remain outside tenant layout */}
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}

