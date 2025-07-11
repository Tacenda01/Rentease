import { Routes, Route } from 'react-router-dom';
import TenantLayout from './TenantLayout';
import SearchProperties from './SearchProperties';
import MyBookings from './MyBookings';
import Messages from './Messages';
import Payments from './Payments';
import ProfileSettings from './ProfileSettings';
import Logout from './Logout';
import NotFound from '../../notfound';
import ProtectedRoute from '../Admin/protectedroute';
import PaymentSuccess from './PaymentSuccess';

export default function TenantRoutes() {
  return (
    <Routes>
      <Route path="" element={<NotFound />} />

      <Route element={<ProtectedRoute allowedRole="tenant" />}>
        <Route path="/" element={<TenantLayout />}>
          <Route path="search" element={<SearchProperties />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
        </Route>
      </Route>

      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}
