import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import TripCard from '../components/TripCard';
import AddTripModal from '../components/AddTripModal';
import TripDetailsModal from '../components/TripDetailsModal';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        userTrend: "0%",
        livePackages: 0,
        activeBookings: 0,
        bookingTrend: "0%"
    });
    const [trips, setTrips] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [tripToEdit, setTripToEdit] = useState(null);
    const user = localStorage.getItem("username");

    const fetchDashboardData = async () => {
        const token = localStorage.getItem("token");
        const headers = { headers: { token } };

        // 1. Fetch Trips independently
        try {
            const tripsRes = await axios.get("http://localhost:5000/api/trips", headers);
            setTrips(tripsRes.data);
        } catch (err) {
            console.error("Error fetching trips inventory:", err);
        }

        // 2. Fetch Stats independently
        try {
            const statsRes = await axios.get("http://localhost:5000/api/admin/stats", headers);
            setStats(statsRes.data);
        } catch (err) {
            console.error("Stats blocked or failed:", err.response?.status);
            // Fallback default state so it doesn't break the application
            setStats({ totalUsers: 0, livePackages: 0, activeBookings: 0 });
        }

        setLoading(false);
    };

    // 🚀 NEW: Integrated Save Logic for Create & Update
    const handleSaveTrip = async (tripData) => {
        try {
            const token = localStorage.getItem("token");

            if (tripToEdit) {
                // UPDATE MODE: Use PUT
                await axios.put(`http://localhost:5000/api/trips/${tripToEdit.id}`, tripData, {
                    headers: { token }
                });
                console.log("Trip updated successfully");
            } else {
                // CREATE MODE: Use POST
                console.log(tripData)
                await axios.post(`http://localhost:5000/api/trips`, tripData, {
                    headers: { token }
                });
                console.log("Trip created successfully");
            }

            // Clean up and refresh
            setIsModalOpen(false);
            setTripToEdit(null);
            fetchDashboardData();
        } catch (err) {
            alert(err.response?.data?.error || "Error saving trip");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this trip?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:5000/api/trips/${id}`, {
                    headers: { token }
                });
                fetchDashboardData();
                if (selectedTrip?.id === id) setSelectedTrip(null);
            } catch (err) {
                alert("Failed to delete trip");
                console.error(err);
            }
        }
    };

    const handleEdit = (trip) => {
        setTripToEdit(trip);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setTripToEdit(null);
        setIsModalOpen(true);
    };

    useEffect(() => { fetchDashboardData(); }, []);

    if (loading) return <div className="p-10 text-center text-blue-600 font-bold">Initializing Dashboard...</div>;

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome {user}👋</h1>
                        <p className="text-gray-500 text-sm">Manage itineraries and monitor booking trends.</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                        <Plus size={20} /> Create a trip
                    </button>
                </div>

                {/* Dynamic Stats Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers.toLocaleString()}
                        trend={`${stats.userTrend}`}
                        up={!stats.userTrend.includes('-')} // Automatically sets true if positive or 0
                    />
                    <StatCard
                        title="Live Packages"
                        value={stats.livePackages}
                        trend="Live"
                        up={true}
                    />
                    <StatCard
                        title="Active Bookings"
                        value={stats.activeBookings}
                        trend={`${stats.bookingTrend}`}
                        up={!stats.bookingTrend.includes('-')}
                    />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-6">Inventory Management</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            onClick={() => setSelectedTrip(trip)}
                            onEdit={() => handleEdit(trip)}
                            onDelete={() => handleDelete(trip.id)}
                        />
                    ))}
                </div>

                <AddTripModal
                    isOpen={isModalOpen}
                    tripToEdit={tripToEdit}
                    onClose={() => {
                        setIsModalOpen(false);
                        setTripToEdit(null);
                    }}
                    onSave={handleSaveTrip} // Pass the integrated handler here
                />
            </div>

            <TripDetailsModal
                trip={selectedTrip}
                isOpen={!!selectedTrip}
                onClose={() => setSelectedTrip(null)}
            />
        </>
    );
};

const StatCard = ({ title, value, trend, up }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{value}</h2>
        <div className={`flex items-center gap-1 text-sm font-bold ${up ? 'text-green-500' : 'text-red-500'}`}>
            {up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {trend} <span className="text-gray-400 font-normal ml-1">vs last month</span>
        </div>
    </div>
);

export default Dashboard;