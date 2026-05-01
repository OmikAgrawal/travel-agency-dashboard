import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [role, setRole] = useState("user"); // Keep lowercase for easier logic
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [action, setAction] = useState("login");
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Determine endpoint based on action
            const endpoint = action === "register" ? "register" : "login";
            const payload = action === "register"
                ? { username, email, password, role }
                : { email, password, role };

            const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);

            // Update the context
            login(res.data.token, res.data.username,role);

            // Redirect based on role
            window.location.href = role === "admin" ? "/dashboard" : "/marketplace";

        } catch (err) {
            alert(err.response?.data?.error || `${action} Failed`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 capitalize">
                    {role} {action}
                </h2>

                <select
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setRole(e.target.value)}
                    value={role}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                {action === "register" && (
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-3 border rounded mb-4 focus:outline-blue-500"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border rounded mb-4 focus:outline-blue-500"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border rounded mb-6 focus:outline-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    {action === "login" ? "Sign In" : "Create Account"}
                </button>

                <div className="mt-4 text-center text-sm">
                    {action === "login" ? (
                        <p>Don't have an account?
                            <button type="button" onClick={() => setAction("register")} className="text-blue-600 ml-1 underline">Register</button>
                        </p>
                    ) : (
                        <p>Already have an account?
                            <button type="button" onClick={() => setAction("login")} className="text-blue-600 ml-1 underline">Login</button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Login;