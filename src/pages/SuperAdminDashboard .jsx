import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LabelList,
} from "recharts";

const SuperAdminDashboard = () => {
    const navigate = useNavigate();

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalTeams, setTotalTeams] = useState(0);
    const [totalQueries, setTotalQueries] = useState(0);
    const [queryTypes, setQueryTypes] = useState([]);
    const [responseTimes, setResponseTimes] = useState([]);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FD0", "#FF6B6B"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users
                const usersRes = await axios.get("http://localhost:5000/api/users/allUsers", { withCredentials: true });
                const users = usersRes.data;
                setTotalUsers(users.length);

                // Fetch queries
                const queriesRes = await axios.get("http://localhost:5000/api/users/my-queries", { withCredentials: true });
                const queries = queriesRes.data.queries;
                setTotalQueries(queries.length);

                // Count teams from tags
                const teamsSet = new Set();
                queries.forEach(q => q.tags?.forEach(tag => teamsSet.add(tag)));
                setTotalTeams(teamsSet.size);

                // Query types for pie chart
                const typeCount = {};
                queries.forEach(q => {
                    const type = q.tags?.[0] || "General";
                    typeCount[type] = (typeCount[type] || 0) + 1;
                });
                setQueryTypes(Object.keys(typeCount).map(key => ({ name: key, value: typeCount[key] })));

                // Response times in hours
                const times = queries.map(q => {
                    const staffMsg = q.messages?.find(m => m.role === "staff");
                    if (staffMsg) {
                        const diff = (new Date(staffMsg.time) - new Date(q.submittedAt)) / (1000 * 60 * 60); // hours
                        return { day: new Date(q.submittedAt).toLocaleDateString(), time: parseFloat(diff.toFixed(2)) };
                    }
                    return null;
                }).filter(Boolean);

                setResponseTimes(times);

            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                    Logout
                </button>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
                    <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
                    <p className="text-sm text-gray-500 mt-1">Registered users in the system</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <h2 className="text-lg font-semibold text-gray-600">Total Teams</h2>
                    <p className="text-3xl font-bold text-gray-800">{totalTeams}</p>
                    <p className="text-sm text-gray-500 mt-1">Distinct teams handling queries</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <h2 className="text-lg font-semibold text-gray-600">Total Queries</h2>
                    <p className="text-3xl font-bold text-gray-800">{totalQueries}</p>
                    <p className="text-sm text-gray-500 mt-1">Total queries submitted by users</p>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-2 gap-6">
                {/* Response Times Line Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">Response Times (hours)</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Time taken by teams to respond to queries (first staff response)
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={responseTimes}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="time"
                                stroke="#8884d8"
                                strokeWidth={2}
                            >
                                <LabelList dataKey="time" position="top" />
                            </Line>
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Query Types Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">Queries by Type</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Distribution of queries across different teams/categories
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={queryTypes}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                fill="#8884d8"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {queryTypes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
