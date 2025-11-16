import Input from "../../components/Auth/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import banner from "../../assets/auth.JPG"

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        if (email === "tech@querynest.com" && password === "123") {
            alert("Staff logged in");
            localStorage.setItem("staffLoggedIn", "true");
            navigate("/Dashboard"); // Redirect to staff dashboard
            return;
        }
        if (email === "superadmin@querynest.com" && password === "123") {
            alert("Admin logged in");
            localStorage.setItem("superAdminLoggedIn", "true");
            navigate("/SuperAdminDashboard"); // Redirect to staff dashboard
            return;
        }

        try {
            await axios.post(
                "https://querynest-8xr5.onrender.com/api/users/login",
                { email, password }, { withCredentials: true }
            );
            alert("Logged in");

            navigate("/home");
            // success

        } catch (error) {
            console.log(error.message);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-6xl">

                <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-2">
                        Query Nest
                    </h1>
                    <h2 className="text-3xl font-semibold text-gray-900 text-center mb-2">
                        Welcome Back!
                    </h2>

                    <p className="text-center text-gray-600 mb-10">
                        Log in to your account to continue.
                    </p>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-6 w-full max-w-sm mx-auto"
                    >
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-40 bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-800 transition-all duration-300 cursor-pointer"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-gray-600 mt-8">
                        Don’t have an account?
                        <a
                            href="/signup"
                            className="text-blue-700 font-semibold hover:underline ml-1"
                        >
                            Sign Up
                        </a>
                    </p>
                </div>

                <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center p-0 bg-gray-50">
                    <img
                        src={banner}
                        alt="QueryNest"
                        className="w-full h-full object-cover rounded-r-2xl"
                    />
                </div>

            </div>
        </div>

    )
}
