import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function ChatBox({ senderId, receiverId, propertyId, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const messagesEndRef = useRef(null);

    const role = localStorage.getItem("role");

    const tenantId = role === "tenant" ? senderId : receiverId;
    const landlordId = role === "tenant" ? receiverId : senderId;

    useEffect(() => {
        const fetchMessages = async () => {
            if (!tenantId || !landlordId || !propertyId) return;

            try {
                const res = await fetch(
                    `http://localhost:5000/api/messages/conversation/${tenantId}/${landlordId}/${propertyId}`
                );
                const data = await res.json();

                if (res.ok && data.success) {
                    setMessages(data.messages);

                    data.messages
                        .filter((msg) => msg.sender_id !== senderId && !msg.is_read)
                        .forEach((msg) => {
                            fetch(`http://localhost:5000/api/messages/read/${msg.id}`, {
                                method: "PATCH",
                            }).catch(err => {
                                console.error(`Failed to mark message ${msg.id} as read:`, err);
                            });
                        });
                } else {
                    console.error("Failed to fetch messages:", data.error || data);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        fetchMessages();
    }, [tenantId, landlordId, propertyId, senderId]);

    const sendMessage = async () => {
        if (!newMsg.trim()) return;

        const payload = {
            tenantId,
            landlordId,
            propertyId,
            message: newMsg,
            senderId,
        };

        const optimisticMsg = {
            message: newMsg,
            created_at: new Date().toISOString(),
            tenant_id: tenantId,
            landlord_id: landlordId,
            property_id: propertyId,
            sender_id: senderId,
            is_read: false,
            id: Math.random().toString(36).substr(2, 9),
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setNewMsg("");

        try {
            const res = await fetch("http://localhost:5000/api/messages/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                console.error("Send message failed with status:", res.status);
            }
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const lastSentIndex = [...messages]
        .map((msg, idx) => ({ msg, idx }))
        .reverse()
        .find(({ msg }) => msg.sender_id === senderId)?.idx;

    return (
        <div className="flex flex-col w-full max-w-md h-[600px] border border-gray-200 rounded-2xl shadow-2xl bg-white overflow-hidden relative">
            <div className="bg-[#00A8F3] text-white py-3 px-4 text-lg font-semibold flex justify-between items-center rounded-t-2xl shadow">
                <span>RentEase Chat</span>
                <button
                    onClick={onClose}
                    className="bg-white hover:bg-gray-100 text-[#00A8F3] p-1 rounded-full shadow-sm"
                >
                    <FaTimes size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                {messages.map((msg, idx) => {
                    const isSentByMe = msg.sender_id === senderId;

                    return (
                        <div
                            key={msg.id || idx}
                            className={`flex items-end gap-2 ${isSentByMe ? "justify-end" : "justify-start"}`}
                        >
                            {!isSentByMe && (
                                <div className="w-7 h-7 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center font-bold">
                                    {role === "tenant" ? "L" : "T"}
                                </div>
                            )}

                            <div
                                className={`max-w-[75%] p-3 rounded-2xl shadow-md relative flex flex-col`}
                                style={{
                                    backgroundColor: isSentByMe ? "#00A8F3" : "#FBBF24",
                                    color: isSentByMe ? "#fff" : "#000",
                                    borderBottomRightRadius: isSentByMe ? "0.75rem" : "1rem",
                                    borderBottomLeftRadius: isSentByMe ? "1rem" : "0.75rem",
                                }}
                            >
                                <div className="text-sm break-words">{msg.message}</div>
                                <div
                                    className={`text-[10px] mt-1 text-right ${isSentByMe ? "text-white/80" : "text-black/70"}`}
                                >
                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}

                                    {isSentByMe && idx === lastSentIndex && (
                                        <span className="ml-2">{msg.is_read ? "Read" : "Sent"}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t bg-white flex items-center gap-3">
                <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00A8F3]"
                />
                <button
                    onClick={sendMessage}
                    className="bg-[#00A8F3] hover:bg-[#0090d1] text-white px-5 py-2 rounded-full font-semibold"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
