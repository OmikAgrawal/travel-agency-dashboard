import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';
import TripCard from '../components/TripCard';

const AITrips = () => {
    const [query, setQuery] = useState({ location: '', duration: '', criteria: '',price: '',category: ''});
    const [loading, setLoading] = useState(false);
    const [newTrip, setNewTrip] = useState(null);

    const generateTrip = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/trips/ai-generate", query);
            setNewTrip(res.data);
        } catch (err) {
            console.error(err);
            alert("AI was unable to generate this trip.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <Sparkles className="text-blue-600" /> AI Trip Architect
                </h1>
                <p className="text-gray-500">Let Gemini design your next perfect getaway</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 mb-10">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        placeholder="Where to?"
                        className="p-3 bg-gray-50 border rounded-xl"
                        onChange={(e) => setQuery({...query, location: e.target.value})}
                    />
                    <input
                        placeholder="How many days?"
                        className="p-3 bg-gray-50 border rounded-xl"
                        onChange={(e) => setQuery({...query, duration: e.target.value})}
                    />

                    <select
                        className="p-3 bg-gray-50 border rounded-xl"
                        onChange={(e) => setQuery({...query, category: e.target.value})}>
                        <option value="">Select your Vibe!!</option>
                        <option value="Adventure and Exploration">Adventure and Exploration</option>
                        <option value="Leisure and Relaxation">Leisure and Relaxation</option>
                        <option value="Cultural and Educational">Cultural and Educational</option>
                        <option value="Social and Celebration">Social and Celebration</option>
                        <option value="Spiritual and Wellness">Spiritual and Wellness</option>
                    </select>

                    <input
                        placeholder="Under ₹"
                        className="p-3 bg-gray-50 border rounded-xl"
                        onChange={(e) => setQuery({...query, price: e.target.value})}
                    />

                </div>
                <textarea
                    placeholder="e.g. I love trekking, need it to be budget friendly, and prefer vegetarian food options."
                    className="w-full p-3 bg-gray-50 border rounded-xl"
                    onChange={(e) => setQuery({...query, criteria: e.target.value})}
                />
                <button
                    onClick={generateTrip}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                    {loading ? "Gemini is thinking..." : "Generate My Trip"}
                </button>
            </div>

            {newTrip && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg font-bold mb-4">Generated Result:</h3>
                    <div className="max-w-sm">
                        <TripCard trip={newTrip} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AITrips;