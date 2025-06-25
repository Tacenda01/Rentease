import { FaHeart } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="p-4 bg-[#F9FAFB] min-h-screen">
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow border border-[#D1D5DB]">
          <h2 className="text-lg font-medium text-[#1F2937]">Active Bookings</h2>
          <p className="text-[#10B981] font-semibold text-xl">3</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow border border-[#D1D5DB]">
          <h2 className="text-lg font-medium text-[#1F2937]">Cancelled Bookings</h2>
          <p className="text-[#EF4444] font-semibold text-xl">1</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow border border-[#D1D5DB] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#1F2937]">Saved Listings</h2>
            <p className="text-[#F59E0B] font-semibold text-xl">5</p>
          </div>
          <FaHeart className="text-[#F59E0B] text-3xl" />
        </div>
      </div>
    </div>
  );
}
