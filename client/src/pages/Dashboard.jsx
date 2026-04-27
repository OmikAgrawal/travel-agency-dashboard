import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import TripCard from '../components/TripCard';
import AddTripModal from '../components/AddTripModal'; // 1. Import it
import TripDetailsModal from '../components/TripDetailsModal';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // 2. Modal State
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [tripToEdit, setTripToEdit] = useState(null); // Track the edit target
    const user = localStorage.getItem("username");

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this trip?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:5000/api/trips/${id}`, {
                    headers: { token }
                });

                // Refresh the list after deleting
                fetchTrips();

                // If the deleted trip was open in the details modal, close it
                if (selectedTrip?.id === id) setSelectedTrip(null);

            } catch (err) {
                alert("Failed to delete the trip. Check console for details.");
                console.error(err);
            }
        }
    };

    const handleEdit = (trip) => {
        console.log("Setting trip to edit:", trip);
        setTripToEdit(trip); // Load trip data
        setIsModalOpen(true); // Open the same modal
    };

    const handleAddNew = () => {
        setTripToEdit(null); // Clear data for fresh trip
        setIsModalOpen(true);
    };


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
        <>
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome {user}👋</h1>
                    <p className="text-gray-500 text-sm">Track activity, trends, and popular destinations in real time</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                    <Plus size={20} /> Create a trip
                </button>


            </div>

            {/* Stats Cards Section (The 3 cards at the top) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Total Users" value="12,450" trend="+12%" up={true} color="green" />
                <StatCard title="Total Trips" value={trips.length} trend="-2%" up={false} color="red" />
                <StatCard title="Active Users Today" value="520" trend="+2%" up={true} color="green" />
            </div>

            {/* Trips Section */}
            <h3 className="text-xl font-bold text-gray-800 mb-6">Trips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trips.map((trip) => (
                    <TripCard
                        key={trip.id}
                        trip={trip}
                        onClick={() => setSelectedTrip(trip)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <AddTripModal
                isOpen={isModalOpen}
                editTrip={tripToEdit}
                onClose={() => {
                    setIsModalOpen(false);
                    setTripToEdit(null); // Clear on close
                }}
                onTripAdded={fetchTrips}
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

// Small helper component for the Top Stats
const StatCard = ({ title, value, trend, up, color }) => (
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

