import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandlordLayout from './landlordlayout';

import {
  Dashboard,
  MyProperties,
  BookingRequests,
  Messages,
  Earnings,
  Reviews,
  Profile
} from './index';

function LandlordRoutes() {
  return (
    <Routes>
      <Route path="/landlord" element={<LandlordLayout />}>
        <Route index element={<Dashboard />} />
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
