
import Sidebar from "../components/UserDashboard/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
export const UserDashboard = () => {
    const [userName, setUserName] = useState("");
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/users/me", {
                    withCredentials: true,
                });
                setUserName(data.userName);
            } catch (error) {
                console.log("Not logged in");
            }
        };

        fetchUser();
    }, []);
    return (
        <><div>{userName?(<div className="flex h-screen">
            <Sidebar />

            <div className="flex-1 p-8 bg-gray-100 overflow-auto">
                <Outlet />
            </div>
        </div>):( <h1>Loading...</h1>)}</div>
        
        </>
    );
};
