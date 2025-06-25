import { Routes, Route, Navigate } from 'react-router-dom';
import LandlordLayout from './landlordlayout';
import Dashboard from './dashboard';
import MyProperties from './myproperties';
import BookingRequests from './bookingrequests';
import Messages from './messages';
import Earnings from './earnings';
import Reviews from './reviews';
import Profile from './profile';
import NotFound from '../../notfound';

function LandlordRoutes() {
  return (
    <Routes>
      <Route path="" element={<NotFound />} />
      <Route path="/" element={<LandlordLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="properties" element={<MyProperties />} />
        <Route path="bookings" element={<BookingRequests />} />
        <Route path="messages" element={<Messages />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/landlord/dashboard" />} />
      </Route>
    </Routes>
  );
}
export default LandlordRoutes;
