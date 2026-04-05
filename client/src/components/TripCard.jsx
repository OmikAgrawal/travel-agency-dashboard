import React from 'react';
import { MapPin, Edit, Trash2 } from 'lucide-react';

const TripCard = ({ trip }) => {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-48">
                <img
                    src={trip.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                    className="w-full h-full object-cover"
                    alt={trip.title}
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
          ₹{trip.price}
        </span>
            </div>

            {/* Info Section */}
            <div className="p-5 flex flex-col flex-1">
                <h4 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{trip.title}</h4>
                <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                    <MapPin size={14} />
                    <span>{trip.location}</span>
                </div>

                {/* Category Badges */}
                <div className="flex gap-2 mb-6">
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                    {trip.category || 'Adventure'}
                  </span>
                </div>
            </div>
        </div>
    );
};

export default TripCard;