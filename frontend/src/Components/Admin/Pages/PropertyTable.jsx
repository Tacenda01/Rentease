export default function PropertyTable() {
  const properties = [
    { name: "Palm Residency", status: "Approved" },
    { name: "Sunview Apartments", status: "Pending" },
  ];

  return (
    <table className="w-full bg-white border border-slate-300 rounded-lg overflow-hidden mt-4">
      <thead className="bg-slate-100">
        <tr>
          <th className="p-2 text-left">Property</th>
          <th className="p-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {properties.map((p, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
            <td className="p-2">{p.name}</td>
            <td className="p-2">
              <span
                className={`px-2 py-1 rounded-md text-white text-sm ${
                  p.status === "Approved" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              >
                {p.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
