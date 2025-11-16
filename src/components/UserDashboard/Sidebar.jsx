
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between p-6">

            <div>
                <h2
                    onClick={() => navigate("/home")}
                    className="text-2xl font-bold mb-10 cursor-pointer hover:text-blue-400 transition"
                >
                    QueryNest
                </h2>

                {/* Main Navigation */}
                <nav className="flex flex-col gap-4 text-lg">

                    <Link
                        to="/dashboard/add-query"
                        className="hover:text-blue-400 transition"
                    >
                        ➕ Add Query
                    </Link>

                    <Link
                        to="/dashboard/chats"
                        className="hover:text-blue-400 transition"
                    >
                        💬 Chats
                    </Link>

                </nav>
            </div>

            {/* Bottom Options */}
            <div className="flex flex-col gap-4 text-lg">

                <Link
                    to="/dashboard/settings"
                    className="hover:text-blue-400 transition"
                >
                    ⚙️ Settings
                </Link>

                <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 transition text-left"
                >
                    🚪 Logout
                </button>

            </div>

        </div>
    );
};

export default Sidebar;
