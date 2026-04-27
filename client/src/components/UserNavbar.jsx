import React from 'react';
import { LogOut, ShoppingBag, Map } from 'lucide-react';

const UserNavbar = () => {
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <nav className="w-full bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
                <Map size={28} />
                <span>TravelMarket</span>
            </div>

            <div className="flex items-center gap-8 font-medium text-gray-600">
                <a href="/marketplace" className="hover:text-blue-600 transition">Marketplace</a>
                <a href="/my-bookings" className="hover:text-blue-600 transition">My Bookings</a>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default UserNavbar;