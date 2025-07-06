import { useState, useEffect } from "react";
import axios from "axios";
import ChatBox from "../Chatbox/chatbox";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const userId = localStorage.getItem("userId");
  const role = "tenant";

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/summary/${userId}/${role}`
        );
        setConversations(res.data?.conversations || []);
      } catch (err) {
        console.error("Error fetching chat summaries:", err);
      }
    };
    fetchConversations();
  }, [userId, role]);

  const handleOpenChat = async (conv) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/messages/mark-read/${conv.property_id}/${userId}/${role}`
      );
      setSelectedChat({
        propertyId: conv.property_id,
        landlordId: conv.landlord_id,
        tenantId: conv.tenant_id,
        propertyTitle: conv.title,
        location: conv.location,
        receiverId: role === "tenant" ? conv.landlord_id : conv.tenant_id,
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.property_id === conv.property_id ? { ...c, has_unread: false } : c
        )
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-start">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
        Your Conversations
      </h1>

      <div className="w-full max-w-2xl">
        {conversations.length === 0 ? (
          <p className="text-center text-gray-500">No conversations found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {conversations.map((conv) => (
              <div
                key={conv.property_id}
                onClick={() => handleOpenChat(conv)}
                className={`rounded-lg shadow-md p-4 cursor-pointer transition mt-2 ${conv.has_unread
                  ? "bg-yellow-100 hover:bg-yellow-200"
                  : "bg-white hover:bg-blue-50"
                  }`}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {conv.title}
                </h2>
                <p className="text-sm text-gray-500">{conv.location}</p>
                <p className="text-sm mt-1 text-gray-700 truncate">
                  {conv.latest_message || "No messages yet"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedChat && (
        <div className="fixed inset-0 z-[70] bg-black bg-opacity-40 flex items-center justify-center">
          <ChatBox
            senderId={userId}
            receiverId={selectedChat.receiverId}
            propertyId={selectedChat.propertyId}
            onClose={() => setSelectedChat(null)}
          />
        </div>
      )}
    </div>
  );
}
