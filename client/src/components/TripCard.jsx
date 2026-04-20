import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const TripCard = ({ trip, onClick }) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0px 20px 30px rgba(0,0,0,0.1)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full cursor-pointer group"
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={trip.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                    className="w-full h-full object-cover transition-transform duration-500"
                    alt={trip.title}
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                    ₹{trip.price}
                </span>
            </div>

            {/* Info Section */}
            <div className="p-5 flex flex-col flex-1">
                <h4 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                    {trip.title}
                </h4>
                <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                    <MapPin size={14} />
                    <span>{trip.location}</span>
                </div>
                <span className="inline-block w-fit bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                    {trip.category || 'Adventure'}
                </span>
            </div>
        </motion.div>
    );
};

export default TripCard;