import React, { useEffect, useState } from "react";
import TripCard from "../components/TripCard.jsx";
import axios from "axios";
import TripDetailsModal from "../components/TripDetailsModal.jsx";
import { Search, Compass, Layers, SlidersHorizontal } from "lucide-react";

const Marketplace = () => {
    const [trips, setTrips] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);

    // Categories array matching your backend and mapping neatly to pill buttons
    const categories = [
        { value: "All", label: "All Vibes" },
        { value: "Adventure and Exploration", label: "Adventure" },
        { value: "Leisure and Relaxation", label: "Relaxation" },
        { value: "Cultural and Educational", label: "Culture" },
        { value: "Social and Celebration", label: "Social" },
        { value: "Spiritual and Wellness", label: "Spiritual" }
    ];

    const filteredTrips = trips.filter(trip => {
        const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase()) ||
            trip.location?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "All" || trip.category === filter;
        return matchesSearch && matchesFilter;
    });

    const fetchTrips = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/trips", {
                headers: { token }
            });
            setTrips(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchTrips(); }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Curating custom itineraries...</p>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
                {/* 🌅 Hero Welcome Header Section */}
                <div className="mb-10 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-xl shadow-blue-100">
                    <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 text-white pointer-events-none">
                        <Compass size={320} />
                    </div>
                    <div className="relative z-10 max-w-xl">
                    <span className="bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md">
                        ✨ Discover Your Next Escape
                    </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-4 mb-2 leading-tight">
                            Explore AI-Generated Adventures
                        </h1>
                        <p className="text-blue-100 text-sm md:text-base opacity-90 font-medium">
                            Seamlessly browse through tailored packages, custom-crafted itineraries, and real-time destination photography.
                        </p>
                    </div>
                </div>

                {/* 🔍 Dynamic Filters Panel */}
                <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-10 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Input Box */}
                        <div className="relative w-full md:flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                placeholder="Where do you want to go? (e.g. Goa, Paris...)"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {/* Native Select Fallback for mobile, beautifully styled */}
                        <div className="w-full md:w-auto relative flex items-center gap-2">
                            <SlidersHorizontal size={16} className="text-gray-400 hidden md:block" />
                            <select
                                className="w-full md:w-64 p-4 border border-gray-100 rounded-2xl bg-gray-50 text-gray-600 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 📱 Desktop Pill Buttons (Scrollable Horizontal Selector) */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide pt-2 border-t border-gray-50">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setFilter(cat.value)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all duration-200 whitespace-nowrap active:scale-[0.98] ${
                                    filter === cat.value
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🗺️ Destinations Grid Section */}
                <div className="flex items-center gap-2 mb-6">
                    <Layers size={18} className="text-gray-400" />
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">Available Packages</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    {filteredTrips.length}
                </span>
                </div>

                {filteredTrips.length === 0 ? (
                    <div className="bg-white p-16 rounded-[2.5rem] border border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
                        <p className="text-gray-400 font-semibold text-lg">No matching escapes found.</p>
                        <p className="text-gray-400 text-sm mt-1">Try tweaking your search keywords or vibe selections.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTrips.map(trip => (
                            <div
                                key={trip.id}
                                className="transform hover:-translate-y-1.5 transition-all duration-300 ease-out"
                            >
                                <TripCard
                                    onClick={() => setSelectedTrip(trip)}
                                    trip={trip}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <TripDetailsModal
                trip={selectedTrip}
                isOpen={!!selectedTrip}
                onClose={() => setSelectedTrip(null)}
            />
        </>
    );
};

export default Marketplace;