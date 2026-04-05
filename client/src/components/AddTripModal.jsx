import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const AddTripModal = ({ isOpen, onClose, onTripAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        category: '',
        image_url: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/trips", formData, {
                headers: { token }
            });
            onTripAdded(); // Refresh the list in the parent
            onClose(); // Close the modal
        } catch (err) {
            alert("Error adding trip: " + err.response?.data?.error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Add New Trip</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input
                        type="text" placeholder="Trip Title (e.g. Goa Escape)" required
                        className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <input
                        type="text" placeholder="Location" required
                        className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                    <div className="flex gap-4">
                        <input
                            type="number" placeholder="Price (₹)" required
                            className="w-1/2 p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                        <select
                            className="w-1/2 p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="Adventure">Adventure</option>
                            <option value="Beach">Beach</option>
                            <option value="City">City</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                    </div>
                    <input
                        type="text" placeholder="Image URL"
                        className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    />
                    <textarea
                        placeholder="Short Description" rows="3"
                        className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        Save Trip
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTripModal;