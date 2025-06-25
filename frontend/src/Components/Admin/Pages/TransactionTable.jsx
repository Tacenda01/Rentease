export default function TransactionTable() {
  const transactions = [
    { id: "#TXN001", user: "Manoj Yadav", amount: 1200 },
    { id: "#TXN002", user: "Sana Khan", amount: 950 },
  ];

  return (
    <table className="w-full mt-4 bg-white border border-slate-300 rounded-lg overflow-hidden">
      <thead className="bg-slate-100">
        <tr>
          <th className="p-2 text-left">Txn ID</th>
          <th className="p-2 text-left">User</th>
          <th className="p-2 text-left">Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
            <td className="p-2">{t.id}</td>
            <td className="p-2">{t.user}</td>
            <td className="p-2">₹{t.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
