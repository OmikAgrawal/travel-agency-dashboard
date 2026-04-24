import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Calendar, Search } from 'lucide-react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/customers");
                setCustomers(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Loading Customers...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customer Directory</h1>
                    <p className="text-gray-500 text-sm">Manage and view all registered users</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-blue-500 transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="p-5 text-sm font-semibold text-gray-600">User</th>
                        <th className="p-5 text-sm font-semibold text-gray-600">Email</th>
                        <th className="p-5 text-sm font-semibold text-gray-600">Joined Date</th>
                        <th className="p-5 text-sm font-semibold text-gray-600 text-right">User ID</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {filteredCustomers.map((user) => (
                        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="p-5 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-800">{user.username}</span>
                            </td>
                            <td className="p-5 text-gray-600">
                                <div className="flex items-center gap-2"><Mail size={14}/> {user.email}</div>
                            </td>
                            <td className="p-5 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14}/>
                                    {new Date(user.created_at).toLocaleDateString('en-GB')}
                                </div>
                            </td>
                            <td className="p-5 text-right text-xs font-mono text-gray-400">
                                #{user.id}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;