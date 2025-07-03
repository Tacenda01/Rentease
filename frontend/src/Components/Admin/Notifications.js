import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Notifications() {
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/contact-messages");
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages", err);
            toast.error("Failed to load messages.");
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleToggleRead = async (id, is_read) => {
        try {
            await axios.patch(`http://localhost:5000/api/contact/${id}`, {
                is_read: !is_read,
            });
            toast.success(`Marked as ${!is_read ? "Read" : "Unread"}`);
            fetchMessages(); // Refresh
        } catch (err) {
            console.error(err);
            toast.error("Failed to update message status.");
        }
    };

    return (
        <div className="p-6 pt-16 sm:pt-4 pl-6">
            <ToastContainer position="top-right" />
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Contact Messages</h2>

            {messages.length === 0 ? (
                <p className="text-gray-600">No messages found.</p>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`border rounded-xl p-5 shadow-sm transition duration-200 ${msg.is_read
                                ? "bg-white border-gray-200"
                                : "bg-yellow-50 border-yellow-300"
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800 text-lg">
                                        {msg.name}{" "}
                                        <span className="text-sm text-gray-600">({msg.email})</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </p>
                                    <p className="text-gray-700">{msg.message}</p>
                                </div>

                                <div className="ml-4">
                                    <button
                                        onClick={() => handleToggleRead(msg.id, msg.is_read)}
                                        className={`px-4 py-1 rounded-md text-sm font-medium shadow ${msg.is_read
                                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                                            : "bg-yellow-400 hover:bg-yellow-500 text-white"
                                            }`}
                                    >
                                        {msg.is_read ? "Mark as Unread" : "Mark as Read"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
