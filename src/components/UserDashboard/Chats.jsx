import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function Chats() {
  const [queries, setQueries] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeRoom, setActiveRoom] = useState("General");
  const [chatMessages, setChatMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");

  const socketRef = useRef(null);
  const username = localStorage.getItem("userName") || "You";
  const token = localStorage.getItem("token");

  // Initialize socket only once
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000");

      // Listener for incoming messages
      socketRef.current.on("receiveMessage", ({ roomId, message }) => {
        setChatMessages((prev) => {
          const updated = { ...prev };
          if (!updated[roomId]) updated[roomId] = {};
          const tag = message.tag || "General";
          if (!updated[roomId][tag]) updated[roomId][tag] = [];
          updated[roomId][tag].push({ ...message, time: new Date(message.time) });
          return updated;
        });
      });
    }

    // Cleanup on unmount

  }, []);

  // Fetch user queries
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/my-queries", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        setQueries(res.data.queries);

        // Initialize chat messages
        const initialChats = {};
        res.data.queries.forEach((q) => {
          initialChats[q._id] = {};
          (q.tags && q.tags.length > 0 ? q.tags : ["General"]).forEach((tag) => {
            initialChats[q._id][tag] = (q.messages || [])
              .filter((msg) => (msg.tag || "General") === tag)
              .map((msg) => ({ ...msg, time: new Date(msg.time || q.submittedAt) }));

            // Add system message if empty
            if (initialChats[q._id][tag].length === 0) {
              initialChats[q._id][tag].push({
                sender: "system",
                text: "Team is on the way.",
                time: new Date(q.submittedAt),
                tag,
                role: "system",
              });
            }
          });
        });
        setChatMessages(initialChats);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch queries");
      }
    };

    fetchQueries();
  }, [token]);

  // Join room when selected
  useEffect(() => {
    if (selectedRoom && socketRef.current) {
      socketRef.current.emit("joinRoom", selectedRoom);
    }
  }, [selectedRoom]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedRoom || !activeRoom) return;

    const message = {
      sender: username,
      text: newMessage,
      role: "user",
      tag: activeRoom,
      time: new Date(),
    };

    // Emit message
    socketRef.current.emit("sendMessage", { roomId: selectedRoom, ...message });

    // Optimistically update UI
    setChatMessages((prev) => {
      const updated = { ...prev };
      if (!updated[selectedRoom]) updated[selectedRoom] = {};
      if (!updated[selectedRoom][activeRoom]) updated[selectedRoom][activeRoom] = [];
      updated[selectedRoom][activeRoom].push(message);
      return updated;
    });

    setNewMessage("");
  };

  return (
    <div className="flex h-full gap-6 p-4">
      {/* Queries Table */}
      <div className="w-2/3 bg-gray-50 shadow-md rounded-lg p-6 overflow-auto max-h-[80vh]">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Query History</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th>Issue</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q, idx) => (
              <tr
                key={q._id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-gray-200 cursor-pointer`}
                onClick={() => {
                  setSelectedRoom(q._id);
                  setActiveRoom(q.tags?.[0] || "General");
                }}
              >
                <td>{q.message}</td>
                <td>{new Date(q.submittedAt).toLocaleString()}</td>
                <td>{q.status || "Pending"}</td>
                <td>{q.priority || "Normal"}</td>
                <td>{q.tags?.join(", ") || "General"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chat Panel */}
      <div className="w-1/3 flex flex-col bg-white shadow-md rounded-lg p-4 max-h-[80vh]">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Chat Room</h2>
        {selectedRoom ? (
          <>
            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-3">
              {queries.find((q) => q._id === selectedRoom)?.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveRoom(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${activeRoom === tag ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  {tag} Team
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto mb-4 space-y-2 px-1">
              {(chatMessages[selectedRoom]?.[activeRoom] || []).map((msg, idx) => {
                const formattedTime = new Date(msg.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl max-w-full ${msg.sender === username ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs text-gray-500 mt-1 block">{formattedTime}</span>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300 text-sm"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-blue-600 transition text-sm"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Click on a query to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
