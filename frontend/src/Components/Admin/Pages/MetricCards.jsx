export default function MetricCards() {
  const metrics = [
    { label: "Total Users", value: 3200 },
    { label: "Properties Listed", value: 785 },
    { label: "Active Bookings", value: 230 },
    { label: "Earnings (This Month)", value: "₹1,24,000" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm"
        >
          <div className="text-gray-500 text-sm">{m.label}</div>
          <div className="text-2xl font-bold text-charcoal">{m.value}</div>
        </div>
      ))}
    </div>
  );
}
