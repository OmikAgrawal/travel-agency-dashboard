import React, {useContext, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Info,CheckCircle } from 'lucide-react';
import {AuthContext} from "../context/AuthContext.jsx";
import axios from "axios";

const TripDetailsModal = ({ trip, isOpen, onClose }) => {
    const {role} = useContext(AuthContext);
    const [bookingStatus, setBookingStatus] = useState(null); // 'loading', 'success', 'error'

    const handleBooking = async () => {
        setBookingStatus('loading');
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/bookings",
                { trip_id: trip.id },
                { headers: { token }}
            );
            setBookingStatus('success');
            // Optional: Close modal after 2 seconds on success
            setTimeout(() => {
                setBookingStatus(null);
                onClose();
            }, 2000);
        } catch (err) {
            alert(err.response?.data?.error || "Booking failed");
            setBookingStatus('error');
        }
    };


    if (!trip || !isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition"
                        >
                            <X size={24} />
                        </button>

                        {/* Left: Image Gallery (Visual Placeholder) */}
                        <div className="md:w-1/2 h-64 md:h-auto relative">
                            <img src={trip.image_url} className="w-full h-full object-cover" alt="" />
                            <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/80 to-transparent w-full text-white">
                                <h2 className="text-3xl font-bold">{trip.title}</h2>
                                <p className="flex items-center gap-2 opacity-80"><MapPin size={18}/> {trip.location}</p>
                            </div>
                        </div>

                        {/* Right: Details & Itinerary */}
                        <div className="md:w-1/2 p-8 overflow-y-auto">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <Info className="text-blue-600" size={20}/> About the Trip
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{trip.description}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Calendar className="text-blue-600" size={20}/> Sample Itinerary
                                </h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(day => (
                                        <div key={day} className="flex gap-4">
                                            <div className="font-bold text-blue-600">Day {day}</div>
                                            <div className="text-gray-500 border-l-2 border-gray-100 pl-4">
                                                Exploring the local culture and historical landmarks of {trip.location}.
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {role === 'user' && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={handleBooking}
                                        disabled={bookingStatus === 'loading' || bookingStatus === 'success'}
                                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                                            bookingStatus === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                                        }`}
                                    >
                                        {bookingStatus === 'loading' && "Processing..."}
                                        {bookingStatus === 'success' && <><CheckCircle size={20}/> Booked Successfully!</>}
                                        {!bookingStatus && `Confirm Booking • ₹${trip.price}`}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TripDetailsModal;