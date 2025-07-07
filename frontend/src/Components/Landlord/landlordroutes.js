import { Routes, Route } from 'react-router-dom';
import LandlordLayout from './landlordlayout';
import MyProperties from './myproperties';
import Bookings from './bookings';
import Messages from './messages';
import Earnings from './earnings';
import Profile from './profile';
import NotFound from '../../notfound';
import ProtectedRoute from '../Admin/protectedroute';

function LandlordRoutes() {
  return (
    <Routes>
      <Route path="" element={<NotFound />} />
      <Route element={<ProtectedRoute allowedRole="landlord" />}>
        <Route path="/" element={<LandlordLayout />}>
          <Route path="properties" element={<MyProperties />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default LandlordRoutes;
