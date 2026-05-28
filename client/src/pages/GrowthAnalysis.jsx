import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, RefreshCw } from 'lucide-react';

const GrowthAnalysis = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/admin/analytics", {
                headers: { token }
            });
            setAnalyticsData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching analytical metrics:", err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnalytics(); }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-sm font-semibold">Compiling time-series indices...</p>
            </div>
        );
    }

    // Calculate total operational revenue across categories
    const totalRevenue = analyticsData?.categoryMetrics?.reduce((sum, item) => sum + parseFloat(item.revenue || 0), 0) || 0;
    const totalBookings = analyticsData?.categoryMetrics?.reduce((sum, item) => sum + parseInt(item.bookings || 0, 10), 0) || 0;

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            {/* Header section with active refetch utility */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Growth & Revenue Analysis</h1>
                    <p className="text-gray-500 text-sm mt-1">Live server log evaluation and performance distribution parameters.</p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="p-3 bg-white border border-gray-100 hover:bg-gray-50 text-gray-600 rounded-2xl shadow-sm transition-all flex items-center gap-2 font-bold text-sm"
                >
                    <RefreshCw size={16} /> Sync Data
                </button>
            </div>

            {/* Micro Summary Performance Indicator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><DollarSign size={24} /></div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Gross Aggregate Income</p>
                        <h3 className="text-2xl font-black text-gray-800 mt-1">₹{totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600"><Calendar size={24} /></div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Accumulated Sales Volume</p>
                        <h3 className="text-2xl font-black text-gray-800 mt-1">{totalBookings} Tickets</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-purple-50 p-4 rounded-2xl text-purple-600"><TrendingUp size={24} /></div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Platform Efficiency Rating</p>
                        <h3 className="text-2xl font-black text-gray-800 mt-1">Active Peak</h3>
                    </div>
                </div>
            </div>

            {/* Graphs Grid System Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 📈 Chart 1: User Growth Timeline (Area Chart) */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wide">Acquisition</span>
                        <h2 className="text-lg font-black text-gray-800 mt-2">New Registrations Trend</h2>
                    </div>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData?.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                                <Area type="monotone" dataKey="counts" name="New Accounts" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 📊 Chart 2: Bookings vs Revenue across Categories (Bar Chart) */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold uppercase tracking-wide">Performance Metrics</span>
                        <h2 className="text-lg font-black text-gray-800 mt-2">Marketplace Category Performance</h2>
                    </div>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData?.categoryMetrics} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="category" stroke="#9ca3af" tickFormatter={(v) => v.split(' ')[0]} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', pt: 10 }} />
                                <Bar dataKey="bookings" name="Tickets Sold" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="revenue" name="Income (₹)" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GrowthAnalysis;