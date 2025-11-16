import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
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
    const handleNavigation = () => {
        navigate("/dashboard");
    }

    return (
        <div>
            {userName ? (
                <div className="min-h-screen bg-gray-50 flex flex-col">

                    <section className="bg-white shadow-md rounded-b-3xl px-6 lg:px-24 py-16 text-center">
                        <h1 className="text-5xl font-extrabold text-blue-700">
                            QueryNest
                        </h1>

                        <p className="text-xl font-medium mt-3 text-gray-700">
                            Audience Query Management & Response System
                        </p>

                        <p className="max-w-3xl mx-auto text-gray-600 mt-6 text-lg leading-relaxed text-justify">
                            QueryNest solves <span className="font-extrabold text-gray-800"> YOUR</span> challenge by connecting
                            <span className="font-extrabold text-gray-800"> YOU</span> to the right teams instantly and resolving issues faster than ever.
                            With a unified dashboard and smart automation, every query is tracked, prioritized,
                            and answered on time so no message ever gets missed again.

                        </p>

                        <h2 className="text-2xl font-semibold mt-10 text-gray-800">
                            Welcome – <span className="text-blue-700">{userName}</span> 👋
                        </h2>
                    </section>

                    <section className="flex flex-col lg:flex-row justify-between items-center px-6 lg:px-24 py-16 gap-12">

                        <div className="w-full lg:w-1/2 space-y-6">
                            <h1 className="text-4xl font-bold text-gray-900">
                                Have any query?
                            </h1>

                            <p className="text-lg text-gray-600">
                                Feel free to reach out with your questions. Our platform ensures your
                                query gets the fastest and most accurate response.
                            </p>

                            <button onClick={handleNavigation} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-blue-800 transition">
                                Ask a Query
                            </button>

                            <p className="text-sm text-gray-500 pt-4">
                                Our team is always ready to help you and provide support whenever you need it.
                            </p>
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1920"
                                alt="QueryNest Dashboard"
                                className="rounded-3xl shadow-lg max-w-lg w-full object-cover"
                            />
                        </div>

                    </section>

                    <footer className="text-center text-gray-500 py-6 border-t">
                        © 2025 QueryNest — Smart Query Management for Modern Brands.
                    </footer>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
};
