// components/AddQueryForm.jsx
import { useState } from "react";

const categoryOptions = [
    "Technical Issue",
    "Account Problem",
    "General Question",
    "Feature Request",
    "UI/UX Feedback",
    "Payment Issue",
];

const AddQueryForm = ({ onSubmit }) => {
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");

    const handleCheckbox = (value) => {
        setCategories((prev) =>
            prev.includes(value)
                ? prev.filter((cat) => cat !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categories.length || !message)
            return alert("All fields are required");

        try {
            const res = await fetch("https://querynest-8xr5.onrender.com/api/users/add-query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // send cookies
                body: JSON.stringify({ categories, message }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Query submitted at " + new Date().toLocaleString());
                setCategories([]);
                setMessage("");
            } else {
                alert(data.message || data.error);
            }
        } catch (err) {
            console.log(err);
            alert("Server error");
        }
    };



    return (
        <form className="bg-white shadow p-8 rounded-xl max-w-xl mx-auto" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-semibold mb-6">Submit a Query</h1>

            <label className="block mb-2 font-medium">Select Categories</label>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {categoryOptions.map((cat) => (
                    <label key={cat} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            value={cat}
                            checked={categories.includes(cat)}
                            onChange={() => handleCheckbox(cat)}
                        />
                        <span>{cat}</span>
                    </label>
                ))}
            </div>

            <label className="block mb-2 font-medium">Your Query</label>
            <textarea
                className="w-full p-3 border rounded mb-4"
                rows="6"
                maxLength={500}
                placeholder="Describe your issue or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
            ></textarea>

            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Submit Query
            </button>
        </form>
    );
};

export default AddQueryForm;
