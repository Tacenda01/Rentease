export default function UserTable() {
  const users = [
    { name: "Amit Sharma", role: "Admin", status: "Active" },
    { name: "Sana Khan", role: "User", status: "Flagged" },
  ];

  return (
    <table className="w-full bg-white border border-slate-300 rounded-lg overflow-hidden mt-4">
      <thead className="bg-slate-100">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Role</th>
          <th className="p-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.role}</td>
            <td className="p-2">
              <span
                className={`px-2 py-1 rounded-md text-white text-sm ${
                  u.status === "Flagged" ? "bg-rose-500" : "bg-emerald-500"
                }`}
              >
                {u.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
