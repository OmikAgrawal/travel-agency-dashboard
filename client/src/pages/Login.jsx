import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, PlaneTakeoff } from 'lucide-react';

const Login = () => {
    const [role, setRole] = useState("user");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [action, setAction] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = action === "register" ? "register" : "login";
            const payload = action === "register"
                ? { username, email, password, role }
                : { email, password, role };

            const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);

            if (action === "register") {
                alert("Registration successful! Please sign in with your credentials.");
                setUsername("");
                setAction("login");
            } else {
                login(res.data.token, res.data.username, role);
                window.location.href = role === "admin" ? "/dashboard" : "/marketplace";
            }
        } catch (err) {
            alert(err.response?.data?.error || `${action} Failed`);
        }
    };

    return (
        /* 🌌 Main Wrapper with Faded Dark Travel Background */
        <div
            className="flex items-center justify-center min-h-screen w-screen m-0 p-0 fixed inset-0 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')`
            }}
        >
            {/* 🖤 Dimmer Overlay with Blur to keep the focus strictly on the form */}
            <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-[4px] z-0" />

            {/* 📄 Glassmorphic/Solid Login Form Box */}
            <form
                onSubmit={handleSubmit}
                className="relative z-10 bg-white/95 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-[26rem] border border-white/20 backdrop-blur-md"
            >

                {/* Logo Section */}
                <div className="flex flex-col items-center justify-center gap-2 mb-6">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shadow-sm shadow-blue-100">
                        <PlaneTakeoff size={28} />
                    </div>
                    <span className="text-2xl font-black text-gray-800 tracking-tight">
                        Travel<span className="text-blue-600">Pro</span>
                    </span>
                    <p className="text-xs text-gray-400 capitalize font-medium tracking-wide mt-1">
                        {role} Portal • {action}
                    </p>
                </div>

                {/* Role Selector */}
                <div className="mb-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">Select Role</label>
                    <select
                        className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 text-gray-700 font-semibold focus:outline-blue-500 appearance-none cursor-pointer"
                        onChange={(e) => setRole(e.target.value)}
                        value={role}
                    >
                        <option value="user">User Account</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>

                {action === "register" && (
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-blue-500 text-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-blue-500 text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Password Input Wrapper */}
                <div className="relative mb-8">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full p-4 border border-gray-200 rounded-2xl pr-12 focus:outline-blue-500 text-sm"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-100 transform active:scale-[0.99]"
                >
                    {action === "login" ? "Sign In" : "Create Account"}
                </button>

                {/* Switch Action Links */}
                <div className="mt-6 text-center text-sm">
                    {action === "login" ? (
                        <p className="text-gray-500">Don't have an account?
                            <button type="button" onClick={() => setAction("register")} className="text-blue-600 font-bold ml-1 hover:underline">Register</button>
                        </p>
                    ) : (
                        <p className="text-gray-500">Already have an account?
                            <button type="button" onClick={() => setAction("login")} className="text-blue-600 font-bold ml-1 hover:underline">Login</button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Login;