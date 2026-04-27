import React from 'react';
import { MapPin, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TripCard = ({ trip, onClick, onEdit, onDelete }) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -10 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full cursor-pointer group relative"
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={trip.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                    className="w-full h-full object-cover"
                    alt={trip.title}
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                    ₹{trip.price}
                </span>
            </div>

            {/* Info Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                        {trip.title}
                    </h4>
                </div>

                <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                    <MapPin size={14} />
                    <span>{trip.location}</span>
                </div>

                {/* Bottom Row: Category and Actions */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                        {trip.category}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(trip); }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TripCard;