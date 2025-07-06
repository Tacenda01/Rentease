import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const tenantId = localStorage.getItem("userId");

  useEffect(() => {
    if (!tenantId) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/tenant/${tenantId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          console.error("Unexpected bookings response:", data);
          setBookings([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
        setBookings([]);
      }
    };

    fetchBookings();
  }, [tenantId]);

  return (
    <div className="p-4 bg-[#F9FAFB] min-h-screen mt-2 ml-2">
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6 text-center sm:text-left">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">You have not booked any properties yet.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-white shadow-sm rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              {booking.images?.length > 0 && (
                <img
                  src={booking.images[0]}
                  alt="Property"
                  className="h-24 w-32 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{booking.title}</h2>
                <p className="text-gray-600">{booking.location}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Move-in:</strong> {new Date(booking.move_in_date).toLocaleDateString("en-IN")}<br />
                  <strong>Duration:</strong> {booking.duration} month(s)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
