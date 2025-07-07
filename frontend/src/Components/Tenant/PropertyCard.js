import { useEffect, useState } from "react";

export default function PropertyCard({ property, onClick }) {
  const [availableDate, setAvailableDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/availability/${property.property_id}`);
        const data = await res.json();
        if (data?.availableDate) {
          setAvailableDate(new Date(data.availableDate));
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [property.property_id]);

  const startDate = availableDate;
  const endDate = new Date(availableDate);
  endDate.setDate(availableDate.getDate() + 3);

  const infoMessage = property.is_booked
    ? "Currently booked. Next available for move-in between"
    : "Available for move-in between";

  return (
    <div
      className="relative group cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden shadow hover:shadow-md transition"
      onClick={onClick}
    >
      <img
        src={property.images[0]}
        alt={property.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-3">
        <h2 className="font-semibold text-[#1F2937]">{property.title}</h2>
        <p className="text-sm text-gray-500">{property.city}</p>
      </div>

      <div className="absolute inset-0 bg-white/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col justify-center">
        <h2 className="text-lg font-semibold text-sky-600">{property.property_type}</h2>
        <h2 className="text-lg font-semibold text-sky-600">{property.title}</h2>
        <p className="text-sm text-gray-600">{property.city}</p>
        <p className="text-md font-bold text-emerald-600 mt-2">₹{property.price}/month</p>

        {!loading && (
          <p className="text-xs text-red-600 mt-2">
            {infoMessage}{" "}
            <strong>{startDate.toLocaleDateString("en-IN")}</strong> to{" "}
            <strong>{endDate.toLocaleDateString("en-IN")}</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
