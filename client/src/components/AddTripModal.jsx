import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const AddTripModal = ({ isOpen, onClose, onTripAdded, editTrip }) => {
    const initialState = {
        title: '',
        description: '',
        location: '',
        price: '',
        category: '',
        image_url: ''
    };
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (isOpen) {
            if (editTrip) {
                // EDIT MODE: Fill the form with existing data
                setFormData({
                    title: editTrip.title || '',
                    description: editTrip.description || '',
                    location: editTrip.location || '',
                    price: editTrip.price || '',
                    image_url: editTrip.image_url || '',
                    category: editTrip.category || ''
                });
            } else {
                // CREATE MODE: Clear the form for a new entry
                setFormData({
                    title: '',
                    description: '',
                    location: '',
                    price: '',
                    image_url: '',
                    category: ''
                });
            }
        }
    }, [editTrip, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const url = editTrip
                ? `http://localhost:5000/api/trips/${editTrip.id}` // Update URL
                : "http://localhost:5000/api/trips";             // Create URL

            const method = editTrip ? "put" : "post";

            await axios[method](url, formData, { headers: { token } });

            onTripAdded(); // Refresh Dashboard
            onClose();     // Close Modal
        } catch (err) {
            console.error(err);
            alert("Error saving trip");
        }
    };

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X /></button>
                <h2 className="text-2xl font-bold mb-6">{editTrip ? "Edit Trip" : "Create New Trip"}</h2>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input
                        value={formData.title}
                        type="text" placeholder="Trip Title (e.g. Goa Escape)" required
                        className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <input
                        value={formData.location}
                        type="text" placeholder="Location" required
                        className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                    <div className="flex gap-4">
                        <input
                            value={formData.price}
                            type="number" placeholder="Price (₹)" required
                            className="w-1/2 p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                        <select
                            value={formData.category}
                            className="w-1/2 p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="">Select your Vibe!!</option>
                            <option value="Adventure and Exploration">Adventure and Exploration</option>
                            <option value="Leisure and Relaxation">Leisure and Relaxation</option>
                            <option value="Cultural and Educational">Cultural and Educational</option>
                            <option value="Social and Celebration">Social and Celebration</option>
                            <option value="Spiritual and Wellness">Spiritual and Wellness</option>
                        </select>
                    </div>
                    <input
                        value={formData.image_url}
                        type="text" placeholder="Image URL"
                        className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    />
                    <textarea
                        value={formData.description}
                        placeholder="Short Description" rows="3"
                        className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        {editTrip ? "Update Trip" : "Save Trip"}
                    </button>
                </form>
            </div>
        </div>

    );
};

export default AddTripModal;