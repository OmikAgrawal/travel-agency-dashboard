import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, MapPin } from 'lucide-react';
import axios from 'axios';

const AddTripModal = ({ isOpen, onClose, tripToEdit, onSave }) => {
    // Standard Fields
    const [formData, setFormData] = useState({
        title: '', location: '', price: '', category: 'Adventure', description: ''
    });

    // Dynamic Fields (Arrays)
    const [images, setImages] = useState(['']); // Array of image URLs
    const [itinerary, setItinerary] = useState([{ day: 1, activities: '' }]);

    // Effect to populate data if in "Edit Mode"
    useEffect(() => {
        if (tripToEdit) {
            setFormData({
                title: tripToEdit.title,
                location: tripToEdit.location,
                price: tripToEdit.price,
                category: tripToEdit.category,
                description: tripToEdit.description
            });
            setImages(tripToEdit.images || [tripToEdit.image_url]);
            setItinerary(tripToEdit.itinerary || [{ day: 1, activities: '' }]);
        } else {
            // Reset for "Create Mode"
            setFormData({ title: '', location: '', price: '', category: 'Adventure', description: '' });
            setImages(['']);
            setItinerary([{ day: 1, activities: '' }]);
        }
    }, [tripToEdit, isOpen]);

    // Handlers for Dynamic Images
    const addImageField = () => setImages([...images, '']);
    const updateImage = (index, value) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    // Handlers for Dynamic Itinerary
    const addDay = () => setItinerary([...itinerary, { day: itinerary.length + 1, activities: '' }]);
    const updateDay = (index, value) => {
        const newItinerary = [...itinerary];
        newItinerary[index].activities = value;
        setItinerary(newItinerary);
    };
    const removeDay = (index) => {
        const newItinerary = itinerary.filter((_, i) => i !== index)
            .map((item, i) => ({ ...item, day: i + 1 })); // Re-index days
        setItinerary(newItinerary);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = { ...formData, images, itinerary };
        onSave(finalData); // Pass to parent function (Create or Update API)
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {tripToEdit ? 'Edit Trip Package' : 'Create New Trip'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            className="p-4 border rounded-2xl w-full"
                            placeholder="Trip Title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                        <input
                            className="p-4 border rounded-2xl w-full"
                            placeholder="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>

                    {/* Price & Vibe Selectors (Restored) */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            className="p-4 border rounded-2xl w-full"
                            placeholder="Price (₹)"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                        <select
                            className="p-4 border rounded-2xl w-full bg-white"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="Adventure">Adventure</option>
                            <option value="Beach">Beach</option>
                            <option value="City">City</option>
                            <option value="Nature">Nature</option>
                        </select>
                    </div>

                    {/* Multiple Images Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                            <ImageIcon size={16}/> Trip Photos (URLs)
                        </label>
                        {images.map((url, idx) => (
                            <input
                                key={idx}
                                className="p-3 border rounded-xl w-full text-sm"
                                placeholder={`Image URL ${idx + 1}`}
                                value={url}
                                onChange={(e) => updateImage(idx, e.target.value)}
                            />
                        ))}
                        <button type="button" onClick={addImageField} className="text-blue-600 text-sm font-bold flex items-center gap-1">
                            <Plus size={16}/> Add another image
                        </button>
                    </div>

                    {/* Dynamic Itinerary Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                            <MapPin size={16}/> Day-by-Day Itinerary
                        </label>
                        {itinerary.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                                <div className="bg-blue-50 text-blue-600 font-bold p-3 rounded-xl min-w-[60px] text-center">
                                    Day {item.day}
                                </div>
                                <textarea
                                    className="flex-1 p-3 border rounded-xl text-sm"
                                    placeholder="What's happening on this day?"
                                    value={item.activities}
                                    onChange={(e) => updateDay(idx, e.target.value)}
                                />
                                {itinerary.length > 1 && (
                                    <button type="button" onClick={() => removeDay(idx)} className="p-3 text-red-400 hover:text-red-600">
                                        <Trash2 size={18}/>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addDay} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium hover:border-blue-300 hover:text-blue-500 transition-all">
                            + Add Next Day
                        </button>
                    </div>

                    <textarea
                        className="p-4 border rounded-2xl w-full h-32"
                        placeholder="Short Description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />

                    <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                        {tripToEdit ? 'Update Trip' : 'Save Trip'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTripModal;