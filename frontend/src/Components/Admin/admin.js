import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../Sidebar";

// Import all page components
import MetricCards from "./Pages/MetricCards";
import UserTable from "./Pages/UserTable";
import PropertyTable from "./Pages/PropertyTable";
import BookingList from "./Pages/BookingList";
import TransactionTable from "./Pages/TransactionTable";
import ReviewList from "./Pages/ReviewList";
import NotificationSenderForm from "./Pages/NotificationSenderForm";
import SettingsForm from "./Pages/SettingsForm";

const Admin = () => {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<MetricCards />} />
          <Route path="users" element={<UserTable />} />
          <Route path="properties" element={<PropertyTable />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="transactions" element={<TransactionTable />} />
          <Route path="reviews" element={<ReviewList />} />
          <Route path="notifications" element={<NotificationSenderForm />} />
          <Route path="settings" element={<SettingsForm />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
