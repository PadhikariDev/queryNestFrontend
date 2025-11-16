import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./pages/Auth/Signup.jsx";
import { Login } from "./pages/Auth/Login.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { UserDashboard } from "./pages/UserDashboard.jsx";
import AddQueryForm from "./components/UserDashboard/AddQueryForm.jsx";
import Chats from "./components/UserDashboard/Chats.jsx";
import Settings from "./components/UserDashboard/Settings.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard .jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/staffDashboard" element={<StaffDashboard />} />
        <Route path="/SuperAdminDashboard" element={<SuperAdminDashboard />} />



        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<UserDashboard />}>
          <Route index element={
            <div className="p-10 text-2xl font-semibold">
              Welcome to your Dashboard 👋
            </div>
          } />
          <Route path="add-query" element={<AddQueryForm />} />
          <Route path="chats" element={<Chats />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
