import { useEffect, useState } from "react";

export default function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const landlordId = localStorage.getItem("userId");

  useEffect(() => {
    if (!landlordId) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/landlord/${landlordId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (error) {
        console.error("Failed to fetch landlord bookings:", error);
      }
    };

    fetchBookings();
  }, [landlordId]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700">
        Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <img
                src={booking.images?.[0]}
                alt="Property"
                className="h-24 w-32 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {booking.title}
                </h2>
                <p className="text-gray-600">{booking.location}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Tenant:</strong> {booking.tenant_name}
                  <br />
                  <strong>Phone:</strong> {booking.tenant_phone}
                  <br />
                  <strong>Move-in:</strong>{" "}
                  {new Date(booking.move_in_date).toLocaleDateString("en-IN")}
                  <br />
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
