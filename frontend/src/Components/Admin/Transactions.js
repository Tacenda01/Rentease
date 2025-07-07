import { useEffect, useState } from "react";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/payment/all");
                const data = await res.json();
                setTransactions(data);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-start text-center sm:items-start sm:text-left">
            <h1 className="text-2xl font-semibold mb-6 text-gray-700 w-full">Transactions</h1>

            {transactions.length === 0 ? (
                <p className="text-gray-500 mt-10 text-center">No transactions found.</p>
            ) : (
                <div className="grid gap-4">
                    {transactions.map((txn) => (
                        <div
                            key={txn.payment_id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                Payment #{txn.payment_id}
                            </h2>

                            <p className="text-sm text-gray-600 mb-1 break-words">
                                <strong>Transaction ID:</strong> <br />
                                <span className="break-all">{txn.transaction_id}</span>
                            </p>
                            <p className="text-sm text-gray-600"><strong>Amount:</strong> ₹{txn.amount}</p>
                            <p className="text-sm text-gray-600"><strong>Status:</strong> {txn.status}</p>
                            <p className="text-sm text-gray-600"><strong>Payment Date:</strong> {txn.payment_date}</p>

                            <div className="mt-3 border-t pt-3 text-sm text-gray-700">
                                <p><strong>Tenant:</strong> {txn.tenant_name || "N/A"}</p>
                                <p><strong>Phone:</strong> {txn.tenant_phone || "N/A"}</p>
                                <p><strong>Move-in Date:</strong> {txn.move_in_date ? new Date(txn.move_in_date).toLocaleDateString("en-IN") : "N/A"}</p>
                                <p><strong>Duration:</strong> {txn.duration ? `${txn.duration} month(s)` : "N/A"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
