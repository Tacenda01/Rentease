export default function BookingList() {
  const bookings = [
    { user: "Karan Singh", date: "2025-06-20", status: "Confirmed" },
    { user: "Preeti Mishra", date: "2025-06-21", status: "Cancelled" },
  ];

  return (
    <ul className="mt-4 space-y-2">
      {bookings.map((b, i) => (
        <li
          key={i}
          className="bg-white border border-slate-300 rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{b.user}</p>
            <p className="text-sm text-gray-500">{b.date}</p>
          </div>
          <span
            className={`px-2 py-1 text-sm rounded-md text-white ${
              b.status === "Confirmed" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            {b.status}
          </span>
        </li>
      ))}
    </ul>
  );
}
