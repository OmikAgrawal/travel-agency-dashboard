import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Info, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";

const TripDetailsModal = ({ trip, isOpen, onClose }) => {
    const { role } = useContext(AuthContext);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // Dynamic Image Array: Uses the main image + 2 related Unsplash categories
    // In a real scenario, you'd store an array of URLs in your DB
    const tripImages =  trip?.images || [];

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev + 1) % tripImages.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev - 1 + tripImages.length) % tripImages.length);
    };

    const handleBooking = async () => {
        setBookingStatus('loading');
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/bookings",
                { trip_id: trip.id },
                { headers: { token } }
            );
            setBookingStatus('success');
            setTimeout(() => {
                setBookingStatus(null);
                onClose();
            }, 2000);
        } catch (err) {
            setBookingStatus('error');
            setTimeout(() => setBookingStatus(null), 2000);
        }
    };

    if (!trip || !isOpen) return null;

    // Assuming trip.itinerary is stored as a JSON array in your DB
    // e.g., [{"day": 1, "activities": "..."}, {"day": 2, "activities": "..."}]
    const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 z-50 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition"
                    >
                        <X size={20} />
                    </button>

                    {/* Left: Image Carousel Section */}
                    <div className="md:w-5/12 h-64 md:h-full relative group">
                        <img
                            src={tripImages[currentImgIndex]}
                            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                            alt={trip.title}
                        />

                        {/* Overlay Text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                            <motion.h2 key={trip.title} initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} className="text-4xl font-bold mb-2">
                                {trip.title}
                            </motion.h2>
                            <p className="flex items-center gap-2 text-lg opacity-90 font-medium">
                                <MapPin size={20} className="text-blue-400"/> {trip.location}
                            </p>
                        </div>

                        {/* Carousel Nav Buttons */}
                        {tripImages.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Right: Details & Itinerary (Scrollable) */}
                    <div className="md:w-7/12 flex flex-col bg-gray-50">
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                            <section className="mb-10">
                                <h3 className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-3 flex items-center gap-2">
                                    <Info size={14}/> Trip Overview
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {trip.description}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-6 flex items-center gap-2">
                                    <Calendar size={14}/> Itinerary Details
                                </h3>

                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-blue-100 before:to-transparent">
                                    {itinerary.length > 0 ? (
                                        itinerary.map((step, index) => (
                                            <div key={index} className="relative pl-12">
                                                <div className="absolute left-0 top-1 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 shadow-sm">
                                                    <span className="text-xs font-black text-blue-600">{step.day}</span>
                                                </div>
                                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                                    <h4 className="font-bold text-gray-800 mb-1">Day {step.day} Adventure</h4>
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {step.activities}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic ml-12">Custom itinerary generation in progress...</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Sticky Footer Action */}
                        {role === 'user' && (
                            <div className="p-8 bg-white border-t border-gray-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                                <button
                                    onClick={handleBooking}
                                    disabled={bookingStatus === 'loading' || bookingStatus === 'success'}
                                    className={`w-full py-5 rounded-2xl font-black text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                                        bookingStatus === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100'
                                    }`}
                                >
                                    {bookingStatus === 'loading' && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {bookingStatus === 'success' && <><CheckCircle size={22}/> Booking Confirmed</>}
                                    {bookingStatus === 'error' && "Already Booked!"}
                                    {!bookingStatus && (
                                        <>
                                            <span>Secure Your Spot Now</span>
                                            <span className="opacity-40 font-light">|</span>
                                            <span>₹{trip.price}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TripDetailsModal;