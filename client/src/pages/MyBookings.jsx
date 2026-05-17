import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Tag, CheckCircle } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/my-bookings", {
                    headers: { token }
                });
                setBookings(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading your adventures...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
            <p className="text-gray-500 mb-8">Manage your upcoming trips and travel history</p>

            {bookings.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                    <p className="text-gray-400 text-lg">No bookings yet. Time to explore the marketplace!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.booking_id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row items-center p-4 gap-6 hover:shadow-md transition-shadow">
                            {/* Trip Image */}
                            <img
                                src={booking.images[0]}
                                alt={booking.title}
                                className="w-full md:w-48 h-32 object-cover rounded-2xl"
                            />

                            {/* Details */}
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <h2 className="text-xl font-bold text-gray-800">{booking.title}</h2>
                                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><MapPin size={14}/> {booking.location}</span>
                                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(booking.booking_date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Price & Status */}
                            <div className="flex flex-col items-center md:items-end gap-2 pr-4">
                                <span className="text-2xl font-black text-blue-600">₹{booking.price}</span>
                                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                    <CheckCircle size={12} /> {booking.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;