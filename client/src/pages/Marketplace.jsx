import React, {useEffect, useState} from "react";
import TripCard from "../components/TripCard.jsx";
import axios from "axios";

const Marketplace = () => {
    const [trips, setTrips] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    const filteredTrips = trips.filter(trip => {
        const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase());
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

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Search and Category Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <input
                    placeholder="Search destinations..."
                    className="flex-1 p-4 rounded-2xl border shadow-sm"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="p-4 rounded-2xl border bg-white shadow-sm"
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Adventure and Exploration">Adventure and Exploration</option>
                    <option value="Leisure and Relaxation">Leisure and Relaxation</option>
                    <option value="Cultural and Educational">Cultural and Educational</option>
                    <option value="Social and Celebration">Social and Celebration</option>
                    <option value="Spiritual and Wellness">Spiritual and Wellness</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                ))}
            </div>
        </div>
    );
};

export default Marketplace;