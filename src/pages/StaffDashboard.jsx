import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const StaffDashboard = () => {
    const [queries, setQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [chatMessages, setChatMessages] = useState({});
    const [newMessage, setNewMessage] = useState("");
    const socketRef = useRef(null);

    const username = localStorage.getItem("userName") || "Staff";
    const staffRole = "Technical";

    // Initialize socket once
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("https://querynest-8xr5.onrender.com");

            socketRef.current.on("receiveMessage", ({ roomId, message }) => {
                setChatMessages((prev) => {
                    const updated = { ...prev };
                    if (!updated[roomId]) updated[roomId] = {};
                    const tag = message.tag || "General";
                    if (!updated[roomId][tag]) updated[roomId][tag] = [];
                    const exists = updated[roomId][tag].some(
                        (m) =>
                            m.sender === message.sender &&
                            m.text === message.text &&
                            new Date(m.time).getTime() === new Date(message.time).getTime()
                    );
                    if (!exists) updated[roomId][tag].push({ ...message, time: new Date(message.time) });

                    return updated;
                });
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off("receiveMessage");
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    // Fetch queries assigned to staff
    useEffect(() => {
        const fetchQueries = async () => {
            try {
                const res = await axios.get("https://querynest-8xr5.onrender.com/api/users/my-queries", {
                    withCredentials: true,
                });

                const filtered = res.data.queries.filter((q) => q.tags.includes(staffRole));
                setQueries(filtered);

                // Initialize chats
                const initialChats = {};
                filtered.forEach((q) => {
                    initialChats[q._id] = {};
                    (q.tags || ["General"]).forEach((tag) => {
                        initialChats[q._id][tag] = (q.messages || [])
                            .filter((m) => (m.tag || "General") === tag)
                            .map((m) => ({ ...m, time: new Date(m.time || q.submittedAt) }));
                    });
                });
                setChatMessages(initialChats);
            } catch (err) {
                console.log(err);
            }
        };
        fetchQueries();
    }, []);

    // Join room when selected
    useEffect(() => {
        if (selectedQuery && socketRef.current) {
            socketRef.current.emit("joinRoom", selectedQuery);
        }
    }, [selectedQuery]);

    const handleSend = () => {
        if (!newMessage.trim() || !selectedQuery) return;

        const message = {
            sender: username,
            text: newMessage,
            role: "staff",
            tag: staffRole,
            time: new Date(),
        };

        socketRef.current.emit("sendMessage", { roomId: selectedQuery, ...message });

        setChatMessages((prev) => {
            const updated = { ...prev };
            if (!updated[selectedQuery]) updated[selectedQuery] = {};
            if (!updated[selectedQuery][staffRole]) updated[selectedQuery][staffRole] = [];
            updated[selectedQuery][staffRole].push(message);
            return updated;
        });

        setNewMessage("");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-bold text-center mb-4">Staff Dashboard</h1>
            <div className="flex gap-6">
                {/* Queries Table */}
                <div className="w-2/3 bg-white shadow-lg rounded-xl p-6 overflow-auto max-h-[80vh]">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th>Issue</th>
                                <th>Submitted</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queries.map((q) => (
                                <tr
                                    key={q._id}
                                    className={`hover:bg-gray-100 cursor-pointer ${selectedQuery === q._id ? "bg-blue-50" : ""}`}
                                    onClick={() => setSelectedQuery(q._id)}
                                >
                                    <td>{q.message}</td>
                                    <td>{new Date(q.submittedAt).toLocaleString()}</td>
                                    <td>{q.status || "Pending"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Chat Panel */}
                <div className="w-1/3 flex flex-col bg-white shadow-lg rounded-xl p-4 max-h-[80vh]">
                    {selectedQuery ? (
                        <>
                            <div className="flex-1 overflow-auto mb-4 space-y-2 px-1">
                                {(chatMessages[selectedQuery]?.[staffRole] || []).map((msg, idx) => {
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
                            Select a query to chat
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
