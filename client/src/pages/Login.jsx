import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import this
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate(); // 2. Initialize the GPS

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

            // 3. Update the context first
            login(res.data.token, res.data.username);

            // 4. Manually tell the browser to move to the dashboard
            navigate("/dashboard");

        } catch (err) {
            alert(err.response?.data?.error || "Login Failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
                <input
                    type="email" placeholder="Email"
                    className="w-full p-3 border rounded mb-4 focus:outline-blue-500"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password" placeholder="Password"
                    className="w-full p-3 border rounded mb-6 focus:outline-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;