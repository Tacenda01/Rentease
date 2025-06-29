import { Routes, Route } from 'react-router-dom';
import TenantLayout from './TenantLayout';
import Dashboard from './Dashboard';
import SearchProperties from './SearchProperties';
import MyBookings from './MyBookings';
import SavedProperties from './SavedProperties';
import Messages from './Messages';
import Payments from './Payments';
import ProfileSettings from './ProfileSettings';
import Logout from './Logout';
import NotFound from '../../notfound';
import ProtectedRoute from '../Admin/protectedroute';

export default function TenantRoutes() {
  return (
    <Routes>
      <Route path="" element={<NotFound />} />
      <Route element={<ProtectedRoute allowedRole="tenant" />}>
        <Route path="/" element={<TenantLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="search" element={<SearchProperties />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="saved" element={<SavedProperties />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>
      </Route>

      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}
