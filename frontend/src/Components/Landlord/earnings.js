import { useEffect, useState } from "react";

export default function LandlordEarnings() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(0);
  const [filters, setFilters] = useState({ propertyId: "", month: "" });
  const [loading, setLoading] = useState(true);
  const landlordId = localStorage.getItem("userId");

  useEffect(() => {
    if (!landlordId) {
      setLoading(false);
      return;
    }

    const fetchEarnings = async () => {
      try {
        const res1 = await fetch(`http://localhost:5000/api/payment/landlord/${landlordId}`);
        const data1 = await res1.json();
        setPayments(data1.payments);
        setFilteredPayments(data1.payments);
        setTotalEarnings(data1.totalEarnings);

        const res2 = await fetch(`http://localhost:5000/api/payment/landlord/${landlordId}/monthly-summary`);
        const data2 = await res2.json();

        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthData = data2.find(item => item.month === currentMonth);
        setThisMonthEarnings(monthData ? parseInt(monthData.total) : 0);
      } catch (err) {
        console.error("Error fetching earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [landlordId]);

  useEffect(() => {
    const filtered = payments.filter(p => {
      const matchesProperty = filters.propertyId
        ? p.booking?.property_id?.includes(filters.propertyId)
        : true;

      const matchesMonth = filters.month
        ? p.payment_date.startsWith(filters.month)
        : true;

      return matchesProperty && matchesMonth;
    });

    setFilteredPayments(filtered);
  }, [filters, payments]);

  if (loading) return <div className="p-4">Loading earnings...</div>;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-[#1F2937] mb-6 text-center md:text-left">
        Earnings Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="p-5 bg-[#EFF6FF] border border-blue-200 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-1">Total Earnings</h2>
          <p className="text-3xl font-bold text-blue-900">₹{totalEarnings}</p>
        </div>
        <div className="p-5 bg-[#ECFDF5] border border-emerald-200 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-emerald-800 mb-1">This Month</h2>
          <p className="text-3xl font-bold text-emerald-900">₹{thisMonthEarnings}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Property ID"
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/2"
          value={filters.propertyId}
          onChange={(e) => setFilters({ ...filters, propertyId: e.target.value })}
        />
        <input
          type="month"
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/2"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        />
      </div>

      <h2 className="text-2xl font-semibold text-[#1F2937] mb-4">Payment Invoices</h2>
      {filteredPayments.length === 0 ? (
        <p className="text-gray-500">No matching invoices found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayments.map((p) => (
            <div
              key={p.payment_id}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-[#374151]">
                  Payment #{p.payment_id}
                </h3>
                <p className="text-xs text-gray-500">
                  Transaction ID: <span className="break-all">{p.transaction_id}</span>
                </p>
              </div>

              <div className="text-sm text-gray-700 space-y-1 mb-4">
                <p><strong>Amount:</strong> ₹{p.amount}</p>
                <p><strong>Status:</strong> {p.status}</p>
                <p><strong>Payment Date:</strong> {p.payment_date}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Booking Details</h4>
                <p className="text-sm text-gray-600"><strong>Booking ID:</strong> {p.booking?.booking_id || "-"}</p>
                <p className="text-sm text-gray-600"><strong>Property ID:</strong> {p.booking?.property_id || "-"}</p>
                <p className="text-sm text-gray-600"><strong>Move-in:</strong> {p.booking?.move_in_date || "-"}</p>
                <p className="text-sm text-gray-600"><strong>Duration:</strong> {p.booking?.duration || "-"} months</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
